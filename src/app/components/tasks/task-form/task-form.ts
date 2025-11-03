import {Component, inject, linkedSignal, WritableSignal} from '@angular/core';
import {Task} from "../../../models/task/Task";
import {Field, FieldState, form, maxLength, minLength, pattern, required, submit} from "@angular/forms/signals";
import {ActivatedRoute, Router} from "@angular/router";
import {TaskStore} from '../../../stores/TaskStore';
import {State} from '../../../models/state/State';

@Component({
    selector: 'app-task-update',
    imports: [Field],
    standalone: true,
    templateUrl: './task-form.html',
    styleUrl: './task-form.css',
})
export class TaskForm {
    #route = inject(ActivatedRoute);
    #router: Router = inject(Router);
    #taskStore = inject(TaskStore);

    readonly taskId = this.#route.snapshot.paramMap.get('id') as string; //TODO

    taskModel: WritableSignal<Task> = linkedSignal(() => {
        return this.#taskStore.getTaskById(Number(this.taskId)) ?? {id: -1, title: "", description: "", state: {id: 1, state: "TODO"} as State };
    });

    protected readonly taskForm = form(this.taskModel, (path) => {
        required(path.title, { message: "Title is required." });
        minLength(path.title, 3, { message: "Title must be at least 3 characters long."});
        maxLength(path.title, 20, { message: "Title must be at least 3 characters long."});

        maxLength(path.description, 250, { message: "Description cannot exceed 250 characters."});

        required(path.state.state, { message: "Status is required." });
        pattern(path.state.state, /^(TODO|IN_PROGRESS|DONE)$/, { message: "Status must be one of: TODO, IN_PROGRESS, DONE" });
    });

    protected showErrors(field: FieldState<string,  string>): boolean {
        return field.touched() && field.errors().length > 0;
    }

    protected onSubmit(event: Event) {
        try {
            submit(this.taskForm, async (form) => {
                this.taskId ?
                    this.#taskStore.updateTask(Number(this.taskId), form().value()) :
                    this.#taskStore.createTask(form().value());
                event.preventDefault();
                this.#router.navigate(['../../'], {relativeTo: this.#route});
            })
            event.preventDefault();
        } catch (e) {
            console.error("Error updating task:", e);
        }
    }
}

