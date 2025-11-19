import {CanActivateFn, CanMatchFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from './auth/auth-service';

export const authGuard: CanMatchFn = (route, segments) => {

    const authService = inject(AuthService);
    const router = inject(Router);

    // La logique de vérification
    if (authService.getConnectionState()) {
        return true;
    }

    return router.parseUrl('/login')
};

