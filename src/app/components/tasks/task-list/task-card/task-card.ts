import {Component, inject, input, InputSignal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Task} from "../../../../models/task/Task";
import {TaskStore} from '../../../../stores/task-store';

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
    #router: Router = inject(Router);
    #route: ActivatedRoute = inject(ActivatedRoute);

    updateTask(event: Event): void {
        event.stopPropagation();
        this.#router.navigate(['update', this.task().id], { relativeTo: this.#route });
    }

    deleteTask(event: Event): void {
        event.stopPropagation();
        this.#taskStore.deleteTaskById(this.task().id);
    }
}
