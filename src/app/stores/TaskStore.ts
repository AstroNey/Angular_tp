import {patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState} from '@ngrx/signals';
import {Task} from '../models/task/Task';
import {computed, effect, inject} from '@angular/core';
import {TaskService} from '../services/task/task-service';
import {lastValueFrom} from 'rxjs/internal/lastValueFrom';
import {State} from '../models/state/State';
import {StateService} from '../services/state/state-service';

interface TaskState {
    tasks: Task[];
    states: State[];
    error: string | null;
}

const initialState: TaskState = {
    tasks: [],
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
        getTaskById(id: number): Task | undefined {
            return store.tasks().find(task => task.id === id);
        },
        async createTask(task: Task): Promise<void> {
            const response: Task = await lastValueFrom(
                store.taskService.createTask(task)
            );
            patchState(store, (state) => ({ tasks: [...state.tasks, response] }));
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
        }
    })),

    withComputed((store) => ({
        isLoading: computed(() => store._tasks.isLoading() ?? false),
        isError: computed(() => store._tasks.error() ?? false),
        stateColumns: computed(() => store.states().length.toString())
    })),

    withHooks(store => ({
        onInit() {
            effect(() => {
                const tasks: Task[] = store._tasks.value();
                if (tasks) {
                    patchState(store, { tasks: tasks });
                }
                const states: State[] = store._states.value();
                console.log("Fetched states:", states);
                if (states) {
                    patchState(store, { states: states });
                }
            });
        }
    }))

);
