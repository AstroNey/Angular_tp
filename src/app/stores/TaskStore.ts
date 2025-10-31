import {patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState} from '@ngrx/signals';
import {Task} from '../models/task/Task';
import {computed, effect, inject} from '@angular/core';
import {TaskService} from '../services/task/task-service';

interface TaskState {
    tasks: Task[];
    filter: string | null;
    error: string | null;
}

const initialState: TaskState = {
    tasks: [],
    filter: 'all',
    error: null
};

export const TaskStore = signalStore(
    { providedIn: 'root' },
    withState<TaskState>(initialState),

    withProps(() => ({
        taskService: inject(TaskService),
    })),

    withProps(({ taskService }) => ({
        _tasks: taskService.getTasks(),
    })),

    withMethods((store) => ({
        getTaskById(id: number) {
            computed(() => store.tasks().find(task => task.id === id));
        },
        createTask(task: Task) {
            patchState(store, (state) => ({
                // TODO call service to update task in backend
                // THEN UPDATE THE LIST IN THE STORE
            }));
        },
        updateTaskById(id: number, task: Task) {
            patchState(store, (state) => ({
                // TODO call service to update task in backend
                // THEN UPDATE THE LIST IN THE STORE
            }));
        },
        deleteTaskById(id: number) {
            patchState(store, (state) => ({
                // TODO call service to delete task in backend
                // THEN UPDATE THE LIST IN THE STORE
            }));
        }
    })),

    withComputed(store => ({
        isLoading: computed(() => store._tasks.isLoading() ?? false),
        isError: computed(() => store._tasks.error() ?? false),
    })),

    withHooks(store => ({
        onInit() {
            effect(() => {
                const tasks = store._tasks.value();
                if (tasks) {
                    patchState(store, { tasks: tasks });
                }
            });
        }
    }))

);
