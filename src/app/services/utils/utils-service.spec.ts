import { TestBed } from '@angular/core/testing';
import { UtilsService } from './utils-service';
import { MessageService } from 'primeng/api';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { firstValueFrom } from 'rxjs';

describe('UtilsService', () => {
    let service: UtilsService;
    let messageServiceMock: MessageService;

    beforeEach(() => {
        messageServiceMock = {
            add: vi.fn(),
            clear: vi.fn()
        } as unknown as MessageService;

        TestBed.configureTestingModule({
            providers: [
                UtilsService,
                { provide: MessageService, useValue: messageServiceMock }
            ]
        });

        TestBed.runInInjectionContext(() => {
            service = TestBed.inject(UtilsService);
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('handleError', () => {
        it('should show error message and return observable of null', async () => {
            const mockError = { text: 'Test error' };

            const res = await firstValueFrom(service.handleError(mockError));
            expect(res).toBeNull();
            expect(messageServiceMock.add).toHaveBeenCalledWith({
                severity: 'error',
                summary: 'Erreur',
                life: 5000,
                detail: 'Test error'
            });
        });

        it('should throw observable when error is null', () => {
            expect(() => service.handleError(null)).toThrow();
        });
    });

    describe('handleSucces', () => {
        it('should show success message and return observable of null', async () => {
            const res = await firstValueFrom(service.handleSucces('Operation réussie'));
            expect(res).toBeNull();
            expect(messageServiceMock.add).toHaveBeenCalledWith({
                severity: 'success',
                summary: 'Succès',
                life: 3000,
                detail: 'Operation réussie'
            });
        });
    });
});
