import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, httpResource, HttpResourceRef} from "@angular/common/http";
import {Task} from '../../models/task/Task';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/tasks';

    getTasks(): HttpResourceRef<Task[]> {
        return httpResource<Task[]>(() => {
                return {
                    url: this.apiUrl,
                    method: "GET"
                };
            }, {
                defaultValue: []
            }
        );
    }

    getTask(id: string): HttpResourceRef<any> | undefined {
        if (!id) {
            return undefined;
        }
        return httpResource<Task[]>(() => {
            return {
                url: `${this.apiUrl}/${id}`,
                method: "GET"
            };
        });
    }

    createTask(task: Partial<Task>): Observable<Task> {
        return this.http.post<Task>(`${this.apiUrl}`, task);
    }

    updateTask(task: Partial<Task>): Observable<Task> {
        return this.http.put<Task>(`${this.apiUrl}`, task);
    }

    deleteTask(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
