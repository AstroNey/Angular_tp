import {provideZonelessChangeDetection} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {App} from './app';
import {beforeEach, describe, expect, it} from "vitest";
import {MessageService} from 'primeng/api';

class MessageServiceMock {
    add() {}
    clear() {}
}

describe('App', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [App],
            providers: [
                provideZonelessChangeDetection(),
                { provide: MessageService, useClass: MessageServiceMock }
            ]
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(App);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });
});
