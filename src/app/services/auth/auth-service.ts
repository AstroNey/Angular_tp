import {computed, inject, Injectable, signal} from '@angular/core';
import {User} from '../../models/user/user';
import {Observable, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AuthResponse} from '../../models/httpModels/AuthResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    http = inject(HttpClient);

    _isConnected = computed(() => localStorage.getItem('accessToken') !== null);
    get isConnected() {
        return this._isConnected();
    }

    register(user: Partial<User>): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(
            'http://localhost:8080/api/auth/register',
            {
                username: user.username,
                password: user.password,
                role: user.role
            })
            .pipe(
                tap((res: AuthResponse) => {
                    localStorage.setItem('accessToken', res.accessToken);
                    localStorage.setItem('refreshToken', res.refreshToken);
                })
            );
    }

    login(user: Partial<User>): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(
            'http://localhost:8080/api/auth/login',
            {
                username: user.username,
                password: user.password
            })
            .pipe(
                tap((res: AuthResponse) => {
                    localStorage.setItem('accessToken', res.accessToken);
                    localStorage.setItem('refreshToken', res.refreshToken);
                })
            );
    }


}
