import {patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState} from '@ngrx/signals';
import {Task} from '../../models/task/Task';
import {computed, effect, inject} from '@angular/core';
import {TaskService} from '../../services/task/task-service';
import {lastValueFrom} from 'rxjs/internal/lastValueFrom';
import {State} from '../../models/state/State';
import {StateStore} from '../states/state-store';
import {AuthService} from '../../services/auth/auth-service';

interface TaskState {
    tasks: Task[];
    tasksByState: Record<string, Task[]>;
}

const initialState: TaskState = {
    tasks: [],
    tasksByState: {}
};

export const TaskStore = signalStore(
    { providedIn: 'root' },
    withState<TaskState>(initialState),

    withProps(() => ({
        taskService: inject(TaskService),
        authService: inject(AuthService),
        stateStore: inject(StateStore),
    })),

    withProps(({ taskService }) => ({
        _tasks: taskService.getTasks()
    })),

    withMethods((store) => ({
        async loadStore() {
            store.taskService.getTasks().subscribe(tasks => {
                patchState(store, { tasks: tasks });
            });
        },
        initMap(): void {
            for (const state of store.stateStore.states()) {
                const tasksForState: Task[] = store.tasks().filter((task: Task) => task.state.state === state.state);
                const orderedTasksForState: Task[] = tasksForState.sort((a: Task, b: Task) => a.order - b.order);
                patchState(store, (actState) => ({
                    tasksByState: {
                        ...actState.tasksByState,
                        [state.state]: orderedTasksForState
                    }
                }));
            }
        },
        getTaskById(id: number): Task | undefined {
            return store.tasks().find(task => task.id === id);
        },
        async createTask(task: Task): Promise<void> {
            const state: string | undefined = store.stateStore.states().find((s: State): boolean => s.id == task.state.id)!.state;
            const stateTasksList: Task[] = store.tasksByState()[state] || [];
            task.order = stateTasksList.length - 1;
            task.state.state = state;
            const response: Task = await lastValueFrom(
                store.taskService.createTask(task)
            );
            patchState(store, (storeState) => ({
                tasks: [...storeState.tasks, response],
            }));
        },
        async updateTask(id: number, task: Task): Promise<void> {
            const response: Task = await lastValueFrom(
                store.taskService.updateTask(task)
            );
            patchState(store, (state) => ({
                tasks: state.tasks.map((t: Task) => t.id === id ? response : t)
            }));
        },
        async deleteTaskById(id: number): Promise<void> {
            await lastValueFrom(
                store.taskService.deleteTask(id)
            )
            patchState(store, (state) =>  ({ tasks: state.tasks.filter((t: Task): boolean => t.id !== id) }) );
        },
        async updateTaskOrder(params: { taskId: number; newIndex: number; newStatus: string }): Promise<void> {
            const currentMapTasks: Task[] = store.tasksByState()[params.newStatus];
            const index: number = currentMapTasks.findIndex((task: Task): boolean => task.id === params.taskId);
            const taskToMove: Task = currentMapTasks.splice(index, 1)[0];
            if (taskToMove) {
                currentMapTasks.splice(params.newIndex, 0, taskToMove);
                currentMapTasks.map((task: Task): number => task.order = currentMapTasks.findIndex((t: Task): boolean => t.id === task.id));
            }
            await lastValueFrom(
                store.taskService.updateTasksOrder(currentMapTasks)
            )
        },
        async transferTask(params: { taskId: number; newStatus: string; newIndex: number }): Promise<void> {
            const sourceState: string | undefined = this.getTaskById(params.taskId)?.state.state;
            if (sourceState) {
                const sourceTaskState: Task[] = store.tasksByState()[sourceState];
                const targetTaskState: Task[] = store.tasksByState()[params.newStatus];
                const index: number = sourceTaskState.findIndex((task: Task): boolean => task.id === params.taskId);
                const taskToMove: Task = sourceTaskState.splice(index, 1)[0];
                if (taskToMove) {
                    taskToMove.state = store.stateStore.states().find((state: State): boolean => state.state === params.newStatus)!;
                    targetTaskState.splice(params.newIndex, 0, taskToMove);
                    targetTaskState.map((task: Task): number => task.order = targetTaskState.findIndex((t: Task): boolean => t.id === task.id));
                    sourceTaskState.map((task: Task): number => task.order = sourceTaskState.findIndex((t: Task): boolean => t.id === task.id));
                }
                const updatedTasks: Task[] = [...sourceTaskState, ...targetTaskState];
                await lastValueFrom(
                    store.taskService.updateTasksOrder(updatedTasks)
                )
            }
        }
    })),

    withComputed((store) => ({
        isReadyToInit: computed((): boolean => store.stateStore.states().length != 0),
    })),

    withHooks(store => ({
        onInit(): void {
            effect((): void => {
                if (store.isReadyToInit()) {
                    store.initMap();
                }
            });
        }
    }))
);
