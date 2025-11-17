import {TestBed} from '@angular/core/testing';

import {TaskService} from './task-service';
import {beforeEach, describe, expect, it} from "vitest";
import {Task} from "../../models/task/Task";
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';

describe('TaskService', () => {
    let service: TaskService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TaskService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });
        service = TestBed.inject(TaskService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getTasks', () => {
        it('should create an HttpResourceRef', () => {
            const result = TestBed.runInInjectionContext(() => service.getTasks());

            expect(result).toBeDefined();
            expect(result.value).toBeDefined();
            expect(result.status).toBeDefined();
        });

        it('should return default empty array initially', () => {
            const result = TestBed.runInInjectionContext(() => service.getTasks());

            expect(result.value()).toEqual([]);
        });

        it('should load tasks from the API', async () => {
            const mockTasks: Task[] = [
                { id: 1, title: 'Task 1', description: 'Description 1', state: { id: 1, state: 'OPEN'} },
                { id: 2, title: 'Task 2', description: 'Description 2', state: { id: 2, state: 'IN_PROGRESS' } }
            ];

            let resourceRef: any;

            TestBed.runInInjectionContext(() => {
                resourceRef = service.getTasks();
            });

            resourceRef.value();
            await new Promise(resolve => setTimeout(resolve, 0));

            const req = httpMock.expectOne('http://localhost:8080/api/tasks');
            expect(req.request.method).toBe('GET');

            req.flush(mockTasks);

            // Wait for the response to be processed
            await new Promise(resolve => setTimeout(resolve, 0));

            expect(resourceRef.value()).toEqual(mockTasks);
        });

        it('should handle HTTP errors gracefully', async () => {
            let resourceRef: any;

            TestBed.runInInjectionContext(() => {
                resourceRef = service.getTasks();
            });

            resourceRef.value();
            await new Promise(resolve => setTimeout(resolve, 0));

            const req = httpMock.expectOne('http://localhost:8080/api/tasks');

            // Simulate an error response
            req.flush('Error loading tasks', {
                status: 500,
                statusText: 'Internal Server Error'
            });

            await new Promise(resolve => setTimeout(resolve, 0));

            // Check error status
            expect(resourceRef.status()).toBe('error');
            expect(resourceRef.error()).toBeDefined();
        });

        it('should have loading status while request is pending', async () => {
            let resourceRef: any;

            TestBed.runInInjectionContext(() => {
                resourceRef = service.getTasks();
            });
            resourceRef.value();
            await new Promise(resolve => setTimeout(resolve, 0));

            expect(resourceRef.status()).toBe('loading');
            expect(resourceRef.isLoading()).toBe(true);

            const req = httpMock.expectOne('http://localhost:8080/api/tasks');
            req.flush([]);

            await new Promise(resolve => setTimeout(resolve, 0));

            expect(resourceRef.status()).toBe('resolved');
            expect(resourceRef.isLoading()).toBe(false);
        });

    });

    describe('createTask', () => {
        it('should create a new task via POST request', () => {
            const newTask: Partial<Task> = { title: 'New Task', description: 'New Description', state: { id: 1, state: 'OPEN' } };
            const createdTask: Task = { id: 3, title: 'New Task', description: 'New Description', state: { id: 1, state: 'OPEN' } };

            service.createTask(newTask).subscribe(task => {
                expect(task).toEqual(createdTask);
            });

            const req = httpMock.expectOne('http://localhost:8080/api/tasks');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(newTask);

            req.flush(createdTask);
        });

        it('should handle create task error', () => {
            const newTask: Partial<Task> = { title: 'New Task', description: 'New Description', state: { id: 1, state: 'OPEN' } };
            let receivedError: any | null = null;

            service.createTask(newTask).subscribe({
                next: () => {
                    // Should not be called when error is returned
                    expect(true).toBe(false);
                },
                error: (error) => {
                    receivedError = error;
                }
            });

            const req = httpMock.expectOne('http://localhost:8080/api/tasks');
            expect(req.request.method).toBe('POST');

            // Simulate an error response
            req.flush('Error creating task', {
                status: 400,
                statusText: 'Bad Request'
            });

            expect(receivedError).toBeTruthy();
            expect(receivedError.status).toBe(400);
            expect(receivedError.statusText).toBe('Bad Request');
        });
    });

    describe('updateTask', () => {
        it('should update an existing task via PUT request', () => {
            const updatedTask: Partial<Task> = { id: 1, title: 'Updated Task', description: 'Test' };
            const responseTask: Partial<Task> = { id: 1, title: 'Updated Task', description: 'Test', state: { id: 2, state: 'IN_PROGRESS' } };

            service.updateTask(updatedTask).subscribe(task => {
                expect(task).toEqual(responseTask);
            });

            const req = httpMock.expectOne('http://localhost:8080/api/tasks');
            expect(req.request.method).toBe('PUT');
            expect(req.request.body).toEqual(updatedTask);

            req.flush(responseTask);
        });

        it('should handle update task error', () => {
            const updatedTask: Partial<Task> = { id: 1, title: 'Updated Task', description: 'Test' };
            let receivedError: any | null = null;

            service.updateTask(updatedTask).subscribe({
                next: () => {
                    // Should not be called when error is returned
                    expect(true).toBe(false);
                },
                error: (error) => {
                    receivedError = error;
                }
            });

            const req = httpMock.expectOne('http://localhost:8080/api/tasks');
            expect(req.request.method).toBe('PUT');

            // Simulate an error response
            req.flush('Error updating task', {
                status: 400,
                statusText: 'Bad Request'
            });

            expect(receivedError).toBeTruthy();
            expect(receivedError.status).toBe(400);
            expect(receivedError.statusText).toBe('Bad Request');
        });
    })

    describe('deleteTask', () => {
        it('should delete a task via DELETE request', () => {
            const taskId = 1;

            service.deleteTask(taskId).subscribe(response => {
                expect(response).toBeNull();
            });
            const req = httpMock.expectOne(`http://localhost:8080/api/tasks/${taskId}`);
            expect(req.request.method).toBe('DELETE');

            req.flush(null);
        });

        it('should handle delete task error', () => {
            const taskId = 1;
            let receivedError: any | null = null;

            service.deleteTask(taskId).subscribe({
                next: () => {
                    expect(true).toBe(false);
                },
                error: (error) => {
                    receivedError = error;
                }
            });

            const req = httpMock.expectOne(`http://localhost:8080/api/tasks/${taskId}`);
            expect(req.request.method).toBe('DELETE');

            // Simulate an error response
            req.flush('Error deleting task', {
                status: 400,
                statusText: 'Bad Request'
            });

            expect(receivedError).toBeTruthy();
            expect(receivedError.status).toBe(400);
            expect(receivedError.statusText).toBe('Bad Request');
        });
    });
});
