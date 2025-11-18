import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormErrors} from './form-errors';
import {beforeEach, describe, expect, it, vi} from "vitest"
import {FieldState} from '@angular/forms/signals';

const mockFieldStateValue = {
    touched: vi.fn(() => true),
    errors: vi.fn(() => [
        { kind: 'required', message: 'Field is required' },
        { kind: 'minlength', message: 'Minimum length is 5' },
    ]),
} as unknown as FieldState<any, any>;

const mockRefCallable = vi.fn(() => mockFieldStateValue);

describe('FormErrors', () => {
    let component: FormErrors;
    let fixture: ComponentFixture<FormErrors>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormErrors]
        }).compileComponents();

        fixture = TestBed.createComponent(FormErrors);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('ref', mockRefCallable);

        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
