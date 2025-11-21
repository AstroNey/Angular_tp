import {inject, Injectable} from '@angular/core';
import {MessageService} from 'primeng/api';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

    #messageService = inject(MessageService);

    handleError(error: any): Observable<any> {
        if (error) {
            this.#messageService.add({
                severity: 'error',
                summary: 'Erreur',
                life: 5000,
                detail: error.text,
            });

            return of(null);
        }

        throw of(error);
    }

    handleSucces(message: string): Observable<any> {
        this.#messageService.add({
            severity: 'success',
            summary: 'Succès',
            life: 3000,
            detail: message,
        });

        return of(null);
    }
}
