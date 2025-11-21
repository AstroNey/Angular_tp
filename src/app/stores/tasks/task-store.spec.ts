import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {TestBed} from '@angular/core/testing';
import {TaskStore} from './task-store';
import {TaskService} from '../../services/task/task-service';
import {Task} from "../../models/task/Task";
import {State} from '../../models/state/State';
import {of} from 'rxjs';
import {StateStore} from '../states/state-store';

describe('TaskStore', () => {
    let taskServiceMock: TaskService;
    let stateStoreMock;
    let store: InstanceType<typeof TaskStore>;

    const dfMockTasks: Task[] = [{ id: 1, title: 'Task 1', description: 'Description 1', state: { id: 1, state: 'To Do', color: "#FFFFFF", order: 1 }, order: 0 }];
    const dfMockStates: State[] = [{ id: 1, state: 'To Do', color: "#FFFFFF", order: 1 }];
    let mockTasks: Task[] = structuredClone(dfMockTasks);
    let mockStates: State[] = structuredClone(dfMockStates);

    beforeEach(() => {
        stateStoreMock = {
            states: vi.fn(() => mockStates),
            stateColumns: vi.fn(() => 1),
            loadStore: vi.fn(),
        } as any;
        taskServiceMock = {
            getTasks: vi.fn(() => of(mockTasks)),
            deleteTask: vi.fn(() => of(void 0)),
            updateTask: vi.fn(),
            createTask: vi.fn(),
            updateTasksOrder: vi.fn(() => of(void 0)),
        } as any;

        TestBed.configureTestingModule({
            providers: [
                { provide: TaskService, useValue: taskServiceMock },
                { provide: StateStore, useValue: stateStoreMock },
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
        // 1. Call the store's load method, which triggers the service call
        store.loadStore();

        // 2. Wait for the asynchronous microtask queue to run (where the subscription/patchState executes)
        await new Promise(resolve => setTimeout(resolve, 0));

        // 3. Manually call initMap() to populate tasksByState
        store.initMap();
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
            const task2: Task = { id: 2, title: 'Task 2', description: 'Description 2', state: { id: 1, state: 'To Do', color: "#FFFFFF", order: 1 }, order: 1 };
            mockTasks.push(task2);
            await load();

            store.updateTaskOrder({ taskId: 2, newIndex: 0, newStatus: 'To Do' });
            expect(store.tasksByState()['To Do'][0].id).toBe(2);
            expect(store.tasksByState()['To Do'][1].id).toBe(1);
        });

        it ('should transfer task to a different state', async () => {
            const stateInProgress: State = { id: 2, state: 'In Progress', color: "#FFFFFF", order: 1 };
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
            const updatedTask: Task = { id: 1, title: 'Updated Task 1', description: 'Updated Description 1', state: { id: 1, state: 'To Do', color: "#FFFFFF", order: 1 }, order : 1 };
            taskServiceMock.updateTask = vi.fn(() => of(updatedTask));
            await store.updateTask(1, updatedTask);
            expect(taskServiceMock.updateTask).toHaveBeenCalledWith(updatedTask);
            expect(store.getTaskById(1)?.title).toBe('Updated Task 1');
        });

        it('should create a new task', async () => {
            await load();
            const newTask: Task = { id: 2, title: 'New Task', description: 'New Description', state: { id: 1, state: 'To Do', color: "#FFFFFF", order: 1 }, order: 1 };
            taskServiceMock.createTask = vi.fn(() => of(newTask));
            await store.createTask(newTask);
            expect(taskServiceMock.createTask).toHaveBeenCalledWith(newTask);
            expect(store.getTaskById(2)).toEqual(newTask);
        });
    });
});
