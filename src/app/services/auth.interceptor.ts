import {HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {AuthService} from './auth/auth-service';
import {inject} from '@angular/core';
import {catchError, of} from 'rxjs';
import {Router} from '@angular/router';
import {UtilsService} from './utils/utils-service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    const authService: AuthService = inject(AuthService);
    const utilsService: UtilsService = inject(UtilsService);
    const router: Router = inject(Router);
    const token: string | null = authService.getToken();


    if (!token) {
        return next(req).pipe(
            catchError(error => {
                if (error.status === 401) {
                    authService.logout();
                    router.navigate(['/login']);
                    utilsService.handleError(error);
                }
                if (error.status === 403) {
                    router.navigate(['/login']);
                    error.text = 'Nom d\'utilisateur ou mot de passe incorrect';
                    utilsService.handleError(error);
                }
                if (error.status === 400) {
                    router.navigate(['/login']);
                    error.text = 'Nom d\'utilisateur existe deja';
                    utilsService.handleError(error);
                }
                return of(error) ;
            })
        );
    }

    const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next(authReq).pipe(
        catchError(error => {
            console.warn(error);
            if (error.status === 401) {
                authService.logout();
                router.navigate(['/login']);
                utilsService.handleError(error);
            }
            if (error.status === 403) {
                router.navigate(['/login']);
                utilsService.handleError(error);
            }
            return of(error) ;
        })
    );
}


