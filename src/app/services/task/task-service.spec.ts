import { TestBed } from '@angular/core/testing';
import { TaskService } from './task-service';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Task } from '../../models/task/Task';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import {MessageService} from 'primeng/api';

describe('TaskService', () => {
    let service: TaskService;
    let httpMock: HttpTestingController;

    const apiUrl = 'http://localhost:8080/api/tasks';

    beforeEach(() => {
        const messageServiceMock = {
            add: () => {},
            clear: () => {},
        } as unknown as MessageService;
        TestBed.configureTestingModule({
            providers: [
                TaskService,
                { provide: MessageService, useValue: messageServiceMock },
                provideHttpClientTesting()
            ],
        });

        TestBed.runInInjectionContext(() => {
            service = TestBed.inject(TaskService);
            httpMock = TestBed.inject(HttpTestingController);
        });
    });

    afterEach(() => {
        if (httpMock) {
            httpMock.verify();
        }
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getTasks', () => {
        const mockTasks: Task[] = [
            { id: 1, title: 'Task 1', description: 'Description 1', state: { id: 1, state: 'OPEN', color: "#FFFFFF", order: 0 }, order: 0 },
            { id: 2, title: 'Task 2', description: 'Description 2', state: { id: 2, state: 'IN_PROGRESS', color: "#FFFFFF", order: 1 }, order: 1 },
        ];

        it('should return tasks on GET', () => {
            let receivedTasks: Task[] | undefined;

            service.getTasks().subscribe(tasks => {
                receivedTasks = tasks;
            });

            const req = httpMock.expectOne(apiUrl);
            expect(req.request.method).toBe('GET');
            req.flush(mockTasks);

            expect(receivedTasks).toEqual(mockTasks);
        });

        it('should handle HTTP errors gracefully', () => {
            let receivedError: any;

            service.getTasks().subscribe({
                next: () => expect(true).toBe(false),
                error: error => receivedError = error
            });

            const req = httpMock.expectOne(apiUrl);
            expect(req.request.method).toBe('GET');
            req.flush('Error loading tasks', { status: 500, statusText: 'Internal Server Error' });

            expect(receivedError).toBeDefined();
            expect(receivedError.status).toBe(500);
        });
    });

    describe('createTask', () => {
        it('should create a new task via POST', () => {
            const newTask: Partial<Task> = { title: 'New Task', description: 'New Description', state: { id: 1, state: 'OPEN', color: "#FFFFFF", order: 0 }, order: 0 };
            const createdTask: Task = { id: 3, title: 'New Task', description: 'New Description', state: { id: 1, state: 'OPEN', color: "#FFFFFF", order: 0 }, order: 1 };

            let result: Task | undefined;
            service.createTask(newTask).subscribe(task => result = task);

            const req = httpMock.expectOne(apiUrl);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(newTask);
            req.flush(createdTask);

            expect(result).toEqual(createdTask);
        });

        it('should handle POST errors', () => {
            const newTask: Partial<Task> = { title: 'New Task', description: 'New Description', state: { id: 1, state: 'OPEN', color: "#FFFFFF", order: 0 }, order: 0 };
            let receivedError: any = null;

            service.createTask(newTask).subscribe({
                next: () => expect(true).toBe(false),
                error: err => receivedError = err
            });

            const req = httpMock.expectOne(apiUrl);
            expect(req.request.method).toBe('POST');
            req.flush('Error creating task', { status: 400, statusText: 'Bad Request' });

            expect(receivedError).toBeTruthy();
            expect(receivedError.status).toBe(400);
        });
    });

    describe('updateTask', () => {
        it('should update an existing task via PUT', () => {
            const updatedTask: Partial<Task> = { id: 1, title: 'Updated Task', description: 'Test' };
            const responseTask: Partial<Task> = { id: 1, title: 'Updated Task', description: 'Test', state: { id: 2, state: 'IN_PROGRESS', color: "#FFFFFF", order: 0 }, order: 0 };

            let result: Partial<Task> | undefined;
            service.updateTask(updatedTask).subscribe(task => result = task);

            const req = httpMock.expectOne(apiUrl);
            expect(req.request.method).toBe('PUT');
            expect(req.request.body).toEqual(updatedTask);
            req.flush(responseTask);

            expect(result).toEqual(responseTask);
        });

        it('should handle PUT errors', () => {
            const updatedTask: Partial<Task> = { id: 1, title: 'Updated Task', description: 'Test' };
            let receivedError: any = null;

            service.updateTask(updatedTask).subscribe({
                next: () => expect(true).toBe(false),
                error: err => receivedError = err
            });

            const req = httpMock.expectOne(apiUrl);
            expect(req.request.method).toBe('PUT');
            req.flush('Error updating task', { status: 400, statusText: 'Bad Request' });

            expect(receivedError).toBeTruthy();
            expect(receivedError.status).toBe(400);
        });
    });

    describe('deleteTask', () => {
        it('should delete a task via DELETE', () => {
            const taskId = 1;
            let result: any = undefined;

            service.deleteTask(taskId).subscribe(res => result = res);

            const req = httpMock.expectOne(`${apiUrl}/${taskId}`);
            expect(req.request.method).toBe('DELETE');
            req.flush(null);

            expect(result).toBeNull();
        });

        it('should handle DELETE errors', () => {
            const taskId = 1;
            let receivedError: any = null;

            service.deleteTask(taskId).subscribe({
                next: () => expect(true).toBe(false),
                error: err => receivedError = err
            });

            const req = httpMock.expectOne(`${apiUrl}/${taskId}`);
            expect(req.request.method).toBe('DELETE');
            req.flush('Error deleting task', { status: 400, statusText: 'Bad Request' });

            expect(receivedError).toBeTruthy();
            expect(receivedError.status).toBe(400);
        });
    });
});
