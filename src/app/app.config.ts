import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {authInterceptor} from './services/auth.interceptor';
import {MessageService} from 'primeng/api';
import {provideAnimations} from '@angular/platform-browser/animations';
import Aura from '@primeuix/themes/aura';
import {providePrimeNG} from 'primeng/config';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(routes),
        provideHttpClient( withInterceptors([authInterceptor])),
        provideAnimations(),
        MessageService,
        providePrimeNG({
            theme: {
                preset: Aura
            }
        })
    ]
};
