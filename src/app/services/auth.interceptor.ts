import {HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {AuthService} from './auth/auth-service';
import {inject} from '@angular/core';
import {catchError, EMPTY, throwError} from 'rxjs';
import {Router} from '@angular/router';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    const authService: AuthService = inject(AuthService);
    const router: Router = inject(Router);
    const token: string | null = authService.getToken();


    if (!token) {
        return next(req);
    }

    const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next(authReq).pipe(
        catchError(error => {
            if (error.status === 401) {
                console.error('Erreur 401: Token expiré ou non valide. Déconnexion...');
                authService.logout();
                router.navigate(['/login']);
                return throwError(() => error);
            }

            return throwError(() => error);
        })
    );
}


