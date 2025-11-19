import {inject, Injectable} from '@angular/core';
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

    getConnectionState(): boolean {
        if (!this.checkTokenValidity()) {
            localStorage.removeItem('accessToken');
            return false;
        }
        return true;
    }

    getToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    decodeToken(): any {
        const token = this.getToken();
        if (!token) {
            return null;
        }

        const payload = token.split('.')[1];
        const decodedPayload = atob(payload);
        return JSON.parse(decodedPayload);
    }

    getExpirationDate(): Date | null {
        const decoded = this.decodeToken();
        if (!decoded || !decoded.exp) {
            return null;
        }

        const date = new Date(0);
        date.setUTCSeconds(decoded.exp);
        return date;
    }

    checkTokenValidity(): boolean {
        const expirationDate = this.getExpirationDate();
        if (!expirationDate) {
            localStorage.removeItem('accessToken');
            return false;
        }
        return expirationDate > new Date();
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
                    this.router.navigate(['/tasks']);
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
                    this.router.navigate(['/tasks']);
                })
            );
    }

    logout(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.router.navigate(['/login']);
    }
}
