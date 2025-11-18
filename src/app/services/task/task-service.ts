import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, httpResource, HttpResourceRef} from "@angular/common/http";
import {Task} from '../../models/task/Task';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private http: HttpClient = inject(HttpClient);
    private apiUrl: string = 'http://localhost:8080/api/tasks';

    getTasks(): HttpResourceRef<Task[]> {
        return httpResource<Task[]>((): {url: string; method: string} => {
                return {
                    url: this.apiUrl,
                    method: "GET",
                };
            }, {
                defaultValue: []
            }
        );
    }

    createTask(task: Partial<Task>): Observable<Task> {
        return this.http.post<Task>(`${this.apiUrl}`, task);
    }

    updateTask(task: Partial<Task>): Observable<Task> {
        return this.http.put<Task>(`${this.apiUrl}`, task);
    }

    updateTasksOrder(tasks: Partial<Task>[]): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/orders`, tasks);
    }

    deleteTask(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
