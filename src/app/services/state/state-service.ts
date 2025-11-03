import {inject, Injectable} from '@angular/core';
import {HttpClient, httpResource, HttpResourceRef} from '@angular/common/http';
import {State} from '../../models/state/State';

@Injectable({
  providedIn: 'root'
})
export class StateService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/states';

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
}
