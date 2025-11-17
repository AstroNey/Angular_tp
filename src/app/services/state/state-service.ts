import {inject, Injectable} from '@angular/core';
import {HttpClient, httpResource, HttpResourceRef} from '@angular/common/http';
import {State} from '../../models/state/State';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/auth/states';

    getStates(): HttpResourceRef<State[]> {
        return httpResource<State[]>(() => {
                return {
                    url: this.apiUrl,
                    method: "GET"
                };
            }, {
                defaultValue: []
            }
        );
    }

    createState(state: Partial<State>): Observable<State> {
        return this.http.post<State>(`${this.apiUrl}`, state);
    }

    deleteState(stateId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${stateId}`);
    }
}
