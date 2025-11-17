import {patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState} from '@ngrx/signals';
import {Task} from '../models/task/Task';
import {computed, effect, inject} from '@angular/core';
import {TaskService} from '../services/task/task-service';
import {lastValueFrom} from 'rxjs/internal/lastValueFrom';
import {State} from '../models/state/State';
import {StateService} from '../services/state/state-service';

interface TaskState {
    tasks: Task[];
    tasksByState: Record<string, Task[]>;
    states: State[];
    error: string | null;
}

const initialState: TaskState = {
    tasks: [],
    tasksByState: {},
    states: [],
    error: null
};

export const TaskStore = signalStore(
    { providedIn: 'root' },
    withState<TaskState>(initialState),

    withProps(() => ({
        taskService: inject(TaskService),
        stateService: inject(StateService),
    })),

    withProps(({ taskService, stateService }) => ({
        _tasks: taskService.getTasks(),
        _states: stateService.getStates(),
    })),

    withMethods((store) => ({
        initMap(): void {
            for (const state of store.states()) {
                const tasksForState = store.tasks().filter(task => task.state.state === state.state);
                const orderedTasksForState = tasksForState.sort((a, b) => a.order - b.order);
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
            const response: Task = await lastValueFrom(
                store.taskService.createTask(task)
            );
            patchState(store, (state) => ({
                tasks: [...state.tasks, response]
            }));
        },
        async updateTask(id: number, task: Task): Promise<void> {
            const response: Task = await lastValueFrom(
                store.taskService.updateTask(task)
            );
            patchState(store, (state) => ({
                tasks: state.tasks.map(t => t.id === id ? response : t)
            }));
        },
        async deleteTaskById(id: number) {
            await lastValueFrom(
                store.taskService.deleteTask(id)
            )
            patchState(store, (state) => ({ tasks: state.tasks.filter(t => t.id !== id) }) );
        },
        async updateTaskOrder(params: { taskId: number; newIndex: number; newStatus: string }): Promise<void> {
            const currentMapTasks = store.tasksByState()[params.newStatus];
            const index = currentMapTasks.findIndex(task => task.id === params.taskId);
            const taskToMove = currentMapTasks.splice(index, 1)[0];
            if (taskToMove) {
                currentMapTasks.splice(params.newIndex, 0, taskToMove);
                currentMapTasks.map((task) => task.order = currentMapTasks.findIndex(t => t.id === task.id));
            }
            await lastValueFrom(
                store.taskService.updateTasksOrder(currentMapTasks)
            )
        },
        async transferTask(params: { taskId: number; newStatus: string; newIndex: number }): Promise<void> {
            const sourceState = this.getTaskById(params.taskId)?.state.state;
            if (sourceState) {
                const sourceTaskState = store.tasksByState()[sourceState];
                const targetTaskState = store.tasksByState()[params.newStatus];
                const index = sourceTaskState.findIndex(task => task.id === params.taskId);
                const taskToMove = sourceTaskState.splice(index, 1)[0];
                if (taskToMove) {
                    taskToMove.state = store.states().find(state => state.state === params.newStatus)!;
                    targetTaskState.splice(params.newIndex, 0, taskToMove);
                    targetTaskState.map((task) => task.order = targetTaskState.findIndex(t => t.id === task.id));
                    sourceTaskState.map((task) => task.order = sourceTaskState.findIndex(t => t.id === task.id));
                }
                const updatedTasks = [...sourceTaskState, ...targetTaskState];
                await lastValueFrom(
                    store.taskService.updateTasksOrder(updatedTasks)
                )
            }

        },
        updateStatesOrder(newStatesOrder: State[]): void {
            patchState(store, { states: [...newStatesOrder]});
        },
        async addState(state: State): Promise<void> {
            const response: State =  await lastValueFrom(
                store.stateService.createState(state)
            );
            patchState(store, (actState) => ({
                states: [...actState.states, response]
            }));
        },
        async deleteStateById(id: number): Promise<void> {
            await lastValueFrom(
                store.stateService.deleteState(id)
            )
            patchState(store, (actState) => ({
                states: actState.states.filter(s => s.id !== id)
            }));
        }
    })),

    withComputed((store) => ({
        stateColumns: computed(() => store.states().length.toString()),
        isAlreadyInitialized: computed(() => store.states().length != 0 && store.tasks().length != 0),
    })),

    withHooks(store => ({
        onInit() {
            effect(() => {
                const tasks: Task[] = store._tasks.value();
                if (tasks && !store.isAlreadyInitialized()) {
                    patchState(store, { tasks: tasks });
                }
                const states: State[] = store._states.value();
                if (states && !store.isAlreadyInitialized()) {
                    patchState(store, { states: states });
                }
                if (store.isAlreadyInitialized()) {
                    store.initMap();
                }
            });
        }
    }))
);
