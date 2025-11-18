import {computed, inject, Injectable, Signal} from '@angular/core';
import {User} from '../../models/user/user';
import {Observable, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AuthResponse} from '../../models/httpModels/AuthResponse';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    http: HttpClient = inject(HttpClient);
    router: Router = inject(Router);

    _isConnected: Signal<boolean> = computed((): boolean => localStorage.getItem('accessToken') !== null);
    get isConnected(): boolean {
        return this._isConnected();
    }

    getToken(): string | null {
        return localStorage.getItem('accessToken');
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

    logout(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.router.navigate(['/login']);
    }

}
