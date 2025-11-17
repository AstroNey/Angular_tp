import {Component, inject, signal} from '@angular/core';
import {State} from '../../../models/state/State';
import {Field, FieldState, form, submit} from '@angular/forms/signals';
import {TaskStore} from '../../../stores/task-store';

@Component({
  selector: 'app-state-form',
    imports: [
        Field
    ],
  templateUrl: './state-form.html',
  styleUrl: './state-form.css',
})
export class StateForm {

    taskStore = inject(TaskStore);

    stateModel = signal<State>({
        id: -1,
        state: ''
    });

    stateForm = form(this.stateModel);

    protected showErrors(field: FieldState<string,  string>): boolean {
        return field.touched() && field.errors().length > 0;
    }

    protected onSubmit(event: SubmitEvent) {
        try {
            submit(this.stateForm, async (form) => {
                this.taskStore.addState(form().value());
                event.preventDefault();
            });
        } catch (e) {
            console.error('Form submission error:', e);
        }
    }
}
