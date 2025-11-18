import {Component, inject, linkedSignal, WritableSignal} from '@angular/core';
import {Task} from "../../../models/task/Task";
import {
    Field,
    FieldPath,
    FieldState,
    FieldTree,
    form,
    maxLength,
    minLength,
    pattern,
    required,
    submit
} from "@angular/forms/signals";
import {ActivatedRoute, Router} from "@angular/router";
import {TaskStore} from '../../../stores/tasks/task-store';
import {State} from '../../../models/state/State';
import {FormErrors} from '../../tools/forms/form-errors/form-errors';
import {StateStore} from '../../../stores/states/state-store';

@Component({
    selector: 'app-task-update',
    imports: [Field, FormErrors],
    standalone: true,
    templateUrl: './task-form.html',
    styleUrl: './task-form.css',
})
export class TaskForm {
    #route: ActivatedRoute = inject(ActivatedRoute);
    #router: Router = inject(Router);
    taskStore = inject(TaskStore);
    stateStore = inject(StateStore);

    readonly taskId: string = this.#route.snapshot.paramMap.get('id') as string;

    taskModel: WritableSignal<Task> = linkedSignal(() => {
        return this.taskStore.getTaskById(Number(this.taskId)) ?? {id: -1, title: "", description: "", state: {id: 1, state: "TODO"} as State, order: 0};
    });

    protected readonly taskForm: FieldTree<Task> = form(this.taskModel, (path: FieldPath<Task>) => {
        required(path.title, { message: "Title is required." });
        minLength(path.title, 3, { message: "Title must be at least 3 characters long."});
        maxLength(path.title, 30, { message: "Title cannot exceed 30 characters."});

        maxLength(path.description, 255, { message: "Description cannot exceed 255 characters."});

        required(path.state.state, { message: "Status is required." });
        pattern(path.state.state, /^(TODO|IN_PROGRESS|DONE)$/, { message: "Status must be one of: TODO, IN_PROGRESS, DONE" });
    });

    protected showErrors(field: FieldState<string,  string>): boolean {
        return field.touched() && field.errors().length > 0;
    }

    protected onSubmit(event: Event): void {
        try {
            submit(this.taskForm, async (form: FieldTree<Task>): Promise<void> => {
                let routeToGo: string[] = ['../'];
                if (this.taskId) {
                    this.taskStore.updateTask(Number(this.taskId), form().value());
                    routeToGo = ['../../'];
                } else {
                    this.taskStore.createTask(form().value());
                }
                event.preventDefault();
                this.#router.navigate(routeToGo, {relativeTo: this.#route});
            });
            event.preventDefault();
        } catch (e) {
            console.error("Error updating task:", e);
        }
    }
}

