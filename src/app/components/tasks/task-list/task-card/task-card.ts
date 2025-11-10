import {Component, inject, input, InputSignal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Task} from "../../../../models/task/Task";
import {TaskStore} from '../../../../stores/TaskStore';

@Component({
    selector: 'app-task-card',
    standalone: true,
    imports: [
        RouterLink
    ],
    templateUrl: './task-card.html',
    styleUrl: './task-card.css',
})
export class TaskCard {
    task: InputSignal<Task> = input.required<Task>();
    #taskStore = inject(TaskStore);

    deleteTask(): void {
        this.#taskStore.deleteTaskById(this.task().id);
    }
}
