import { Component, signal, WritableSignal } from '@angular/core';
import { Task } from "../../../models/task/Task";
import {Field, form } from "@angular/forms/signals";

@Component({
    selector: 'app-task-update',
    imports: [Field],
    standalone: true,
    templateUrl: './task-update.html',
    styleUrl: './task-update.css',
})
export class TaskUpdate {
    taskModel: WritableSignal<Task> = signal<Task>({id: -1, title: "", description: "", status: "TODO"});

    taskForm = form(this.taskModel);
}
