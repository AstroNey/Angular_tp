import {Component, inject, signal, WritableSignal} from '@angular/core';
import {State} from '../../../models/state/State';
import {
    Field,
    FieldPath,
    FieldState,
    FieldTree,
    form,
    maxLength,
    minLength,
    required,
    submit
} from '@angular/forms/signals';
import {ActivatedRoute, Router} from '@angular/router';
import {FormErrors} from '../../tools/forms/form-errors/form-errors';
import {StateStore} from '../../../stores/states/state-store';

@Component({
  selector: 'app-state-form',
    imports: [
        Field,
        FormErrors
    ],
  templateUrl: './state-form.html',
  styleUrl: './state-form.css',
})
export class StateForm {

    stateStore = inject(StateStore);
    #route: ActivatedRoute = inject(ActivatedRoute);
    router: Router = inject(Router);

    readonly order: number = Number(this.#route.snapshot.paramMap.get('order'));

    stateModel: WritableSignal<State> = signal<State>({
        id: -1,
        state: '',
        color: '#000000',
        order: this.order ?? 0
    });

    stateForm: FieldTree<State> = form(this.stateModel, (path: FieldPath<State>) => {
        required(path.state, { message: "State name is required." });
        minLength(path.state, 3, { message: "State name must be at least 3 characters long."})
        maxLength(path.state, 15, { message: "State name cannot exceed 15 characters."});
    });

    protected showErrors(field: FieldState<string,  string>): boolean {
        return field.touched() && field.errors().length > 0;
    }

    protected onSubmit(event: SubmitEvent): void {
        try {
            submit(this.stateForm, async (form: FieldTree<State>): Promise<void> => {
                this.stateStore.addState(form().value());
                event.preventDefault();
                this.router.navigate(['tasks']);
            });
        } catch (e) {
            console.error('Form submission error:', e);
        }
    }
}
