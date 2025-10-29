import {Component, inject, input, InputSignal} from '@angular/core';
import {NgClass} from '@angular/common';
import {RouterLink} from '@angular/router';
import { Task } from "../../../../models/task/Task";
import { TaskService } from "../../../../services/task/task-service";

@Component({
    selector: 'app-task-card',
    standalone: true,
    imports: [
        NgClass,
        RouterLink
    ],
    templateUrl: './task-card.html',
    styleUrl: './task-card.css',
})
export class TaskCard {
    task: InputSignal<Task> = input.required<Task>();
    #TaskService = inject(TaskService);

    deleteTask(): void {
        this.#TaskService.deleteTask(this.task().id).subscribe({
            next: () => {
                // TODO update front list of tasks
            }
        });
    }
}
