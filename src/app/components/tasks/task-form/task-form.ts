import { Component, computed, effect, inject, linkedSignal, signal, WritableSignal } from '@angular/core';
import { Task } from "../../../models/task/Task";
import {Field, form, submit } from "@angular/forms/signals";
import { TaskService } from "../../../services/task/task-service";
import { ActivatedRoute, Router } from "@angular/router";
import { lastValueFrom } from "rxjs/internal/lastValueFrom";

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
    readonly taskRessource = this.#taskService.getTask(this.taskId);

    taskModel: WritableSignal<Task> = linkedSignal(() => {
        return this.taskRessource.hasValue() ? this.taskRessource.value() : {id: -1, title: "", description: "", status: "TODO"};
    })
    taskForm = form(this.taskModel);

    protected onSubmit(event: Event) {
        try {
            submit(this.taskForm, async () => {
                let responsedTask: Task;
                if (this.taskId) {
                    responsedTask = await lastValueFrom(
                        this.#taskService.updateTask(this.taskModel())
                    );
                }
                else {
                    responsedTask = await lastValueFrom(
                        this.#taskService.createTask(this.taskModel())
                    );
                }
                this.taskModel.set(responsedTask);
                this.#router.navigate(['../../'], { relativeTo: this.#route });
            })
            event.preventDefault();
        } catch (e) {
            console.error("Error updating task:", e);
        }
    }
}
