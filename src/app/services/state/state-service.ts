import {inject, Injectable} from '@angular/core';
import {HttpClient, httpResource, HttpResourceRef} from '@angular/common/http';
import {State} from '../../models/state/State';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
    private http: HttpClient = inject(HttpClient);
    private apiUrl: string = 'http://localhost:8080/api/states';

    getStates(): HttpResourceRef<State[]> {
        return httpResource<State[]>((): {url: string; method : string} => {
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
