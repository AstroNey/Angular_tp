import {Component, inject, signal, WritableSignal} from '@angular/core';
import {State} from '../../../models/state/State';
import {Field, FieldState, FieldTree, form, submit} from '@angular/forms/signals';
import {TaskStore} from '../../../stores/task-store';
import {Router} from '@angular/router';
import {FormErrors} from '../../tools/forms/form-errors/form-errors';

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

    taskStore = inject(TaskStore);
    route: Router = inject(Router);

    stateModel: WritableSignal<State> = signal<State>({
        id: -1,
        state: '',
        color: '#000000'
    });

    stateForm: FieldTree<State> = form(this.stateModel);

    protected showErrors(field: FieldState<string,  string>): boolean {
        return field.touched() && field.errors().length > 0;
    }

    protected onSubmit(event: SubmitEvent): void {
        try {
            submit(this.stateForm, async (form: FieldTree<State>): Promise<void> => {
                this.taskStore.addState(form().value());
                event.preventDefault();
                this.route.navigate(['tasks']);
            });
        } catch (e) {
            console.error('Form submission error:', e);
        }
    }
}
