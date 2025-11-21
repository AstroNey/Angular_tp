import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {TestBed} from '@angular/core/testing';
import {TaskStore} from './task-store';
import {TaskService} from '../../services/task/task-service';
import {Task} from "../../models/task/Task";
import {HttpResourceRef} from '@angular/common/http';
import {State} from '../../models/state/State';
import {signal, WritableSignal} from '@angular/core';
import {StateService} from '../../services/state/state-service';
import {of} from 'rxjs';

describe('TaskStore', () => {
    let taskServiceMock: TaskService;
    let stateServiceMock: StateService;
    let store: InstanceType<typeof TaskStore>;

    const dfMockTasks: Task[] = [{ id: 1, title: 'Task 1', description: 'Description 1', state: { id: 1, state: 'To Do', color: "#FFFFFF" }, order: 0 }];
    const dfMockStates: State[] = [{ id: 1, state: 'To Do', color: "#FFFFFF" }];
    let mockTasks: Task[] = structuredClone(dfMockTasks);
    let mockStates: State[] = structuredClone(dfMockStates);

    beforeEach(() => {
        const mockTasksResource: HttpResourceRef<Task[]> = {
            value: signal([] as Task[]) as WritableSignal<Task[]>,
            isLoading: vi.fn(() => false),
        } as any;
        const mockStatesResource: HttpResourceRef<State[]> = {
            value: signal([] as State[]) as WritableSignal<State[]>,
            isLoading: vi.fn(() => false),
        } as any;
        taskServiceMock = {
            getTasks: vi.fn(() => mockTasksResource),
            deleteTask: vi.fn(() => of(void 0)),
            updateTask: vi.fn(),
            createTask: vi.fn(),
            updateTasksOrder: vi.fn(() => of(void 0)),
        } as any;
        stateServiceMock = {
            getStates: vi.fn(() => mockStatesResource),
        } as any;

        TestBed.configureTestingModule({
            providers: [
                { provide: TaskService, useValue: taskServiceMock },
                { provide: StateService, useValue: stateServiceMock },
                TaskStore,
            ],
        });

        TestBed.runInInjectionContext(() => {
            store = TestBed.inject(TaskStore);
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
        mockTasks = structuredClone(dfMockTasks);
        mockStates = structuredClone(dfMockStates);
    });

    const load = async () => {
        const tasksResource: HttpResourceRef<Task[]> = taskServiceMock.getTasks();
        const statesResource: HttpResourceRef<State[]> = stateServiceMock.getStates();
        (tasksResource.value as WritableSignal<Task[]>).set(mockTasks);
        (statesResource.value as WritableSignal<State[]>).set(mockStates);

        await new Promise(resolve => setTimeout(resolve, 0));
    }

    it('should be defined', () => {
        expect(store).toBeDefined();
    });

    it('should initialize with default state', () => {
        expect(store.tasks()).toEqual([]);
        expect(store.tasksByState()).toEqual({});
    });

    it('should initialize and patch tasks and states on first load', async () => {
        await load();

        expect(store.tasks()).toEqual(mockTasks);
    });

    it('should fill tasksByState when initMap is called', async () => {
        await load();
        const expectedDict = {
            'To Do': [mockTasks[0]]
        };
        expect(store.tasksByState()).toEqual(expectedDict);
    });

    describe('methods', () => {
        it('getTaskById should return the correct task', async () => {
            await load();
            const task = store.getTaskById(1);
            expect(task).toEqual(mockTasks[0]);
        });

        it('getTaskById should return undefined for non-existing task', async () => {
            await load();
            const task = store.getTaskById(999);
            expect(task).toBeUndefined();
        });


        it ('should update task order within the same state', async () => {
            const task2: Task = { id: 2, title: 'Task 2', description: 'Description 2', state: { id: 1, state: 'To Do', color: "#FFFFFF" }, order: 1 };
            mockTasks.push(task2);
            await load();

            store.updateTaskOrder({ taskId: 2, newIndex: 0, newStatus: 'To Do' });
            expect(store.tasksByState()['To Do'][0].id).toBe(2);
            expect(store.tasksByState()['To Do'][1].id).toBe(1);
        });

        it ('should transfer task to a different state', async () => {
            const stateInProgress: State = { id: 2, state: 'In Progress', color: "#FFFFFF" };
            mockStates.push(stateInProgress);
            await load();

            store.transferTask({ taskId: 1, newStatus: 'In Progress', newIndex: 0 });
            expect(store.tasksByState()['In Progress'][0].id).toBe(1);
            expect(store.tasksByState()['To Do'].length).toBe(0);
            expect(store.getTaskById(1)?.state.state).toBe('In Progress');
        });

        it('should delete task by id', async () => {
            await load();
            await store.deleteTaskById(1);
            expect(taskServiceMock.deleteTask).toHaveBeenCalledWith(1);
            expect(store.tasks().length).toBe(0);
        });

        it('should update task by id', async () => {
            await load();
            const updatedTask: Task = { id: 1, title: 'Updated Task 1', description: 'Updated Description 1', state: { id: 1, state: 'To Do', color: "#FFFFFF" }, order : 1 };
            taskServiceMock.updateTask = vi.fn(() => of(updatedTask));
            await store.updateTask(1, updatedTask);
            expect(taskServiceMock.updateTask).toHaveBeenCalledWith(updatedTask);
            expect(store.getTaskById(1)?.title).toBe('Updated Task 1');
        });

        it('should create a new task', async () => {
            await load();
            const newTask: Task = { id: 2, title: 'New Task', description: 'New Description', state: { id: 1, state: 'To Do', color: "#FFFFFF" }, order: 1 };
            taskServiceMock.createTask = vi.fn(() => of(newTask));
            await store.createTask(newTask);
            expect(taskServiceMock.createTask).toHaveBeenCalledWith(newTask);
            expect(store.getTaskById(2)).toEqual(newTask);
        });
    });
});
