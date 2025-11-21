import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {State} from '../../models/state/State';
import {Observable} from 'rxjs';
import {Task} from '../../models/task/Task';

@Injectable({
  providedIn: 'root'
})
export class StateService {
    private http: HttpClient = inject(HttpClient);
    private apiUrl: string = 'http://localhost:8080/api/states';

    getStates(): Observable<State[]> {
        return this.http.get<State[]>(`${this.apiUrl}`);
    }

    createState(state: Partial<State>): Observable<State> {
        return this.http.post<State>(`${this.apiUrl}`, state);
    }

    updateStatesOrder(states: Partial<State>[]): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/orders`, states);
    }

    deleteState(stateId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${stateId}`);
    }
}
