import {Component, inject, linkedSignal, WritableSignal} from '@angular/core';
import {Task} from "../../../models/task/Task";
import {Field, FieldState, form, maxLength, minLength, pattern, required, submit} from "@angular/forms/signals";
import {TaskService} from "../../../services/task/task-service";
import {ActivatedRoute, Router} from "@angular/router";
import {lastValueFrom} from "rxjs/internal/lastValueFrom";
import {HttpResourceRef} from '@angular/common/http';

@Component({
    selector: 'app-task-update',
    imports: [Field],
    standalone: true,
    templateUrl: './task-form.html',
    styleUrl: './task-form.css',
})
export class TaskForm {
    #route = inject(ActivatedRoute);
    #taskService = inject(TaskService);
    #router: Router = inject(Router);

    readonly taskId = this.#route.snapshot.paramMap.get('id') as string;
    readonly taskRessource: HttpResourceRef<any> | undefined = this.#taskService.getTask(this.taskId);

    taskModel: WritableSignal<Task> = linkedSignal(() => {
        return this.taskRessource !== undefined ? this.taskRessource.value() : {id: -1, title: "", description: "", status: "TODO"};
    })

    protected readonly taskForm = form(this.taskModel, (path) => {
        required(path.title, { message: "Title is required." });
        minLength(path.title, 3, { message: "Title must be at least 3 characters long."});
        maxLength(path.title, 20, { message: "Title must be at least 3 characters long."});

        maxLength(path.description, 250, { message: "Description cannot exceed 250 characters."});

        required(path.status, { message: "Status is required." });
        pattern(path.status, /^(TODO|IN_PROGRESS|DONE)$/, { message: "Status must be one of: TODO, IN_PROGRESS, DONE" });
    });

    protected showErrors(field: FieldState<string,  string>): boolean {
        return field.touched() && field.errors().length > 0;
    }

    protected onSubmit(event: Event) {
        try {
            submit(this.taskForm, async (form) => {
                let responsedTask: Task;
                if (this.taskId) {
                    responsedTask = await lastValueFrom(
                        this.#taskService.updateTask(form().value())
                    );
                }
                else {
                    responsedTask = await lastValueFrom(
                        this.#taskService.createTask(form().value())
                    );
                }
                this.taskModel.set(responsedTask);
                event.preventDefault();
                this.#router.navigate(['../../'], { relativeTo: this.#route });
            })
            event.preventDefault();
        } catch (e) {
            console.error("Error updating task:", e);
        }
    }
}

