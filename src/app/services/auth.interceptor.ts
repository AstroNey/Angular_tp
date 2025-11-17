import {HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {AuthService} from './auth/auth-service';
import {inject} from '@angular/core';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    const authService = inject(AuthService);
    const token = authService.getToken();

    if (!token) {
        return next(req);
    }

    const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next(authReq);
}

