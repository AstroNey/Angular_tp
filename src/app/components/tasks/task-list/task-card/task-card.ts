import {Component, inject, input, InputSignal, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Task} from "../../../../models/task/Task";
import {TaskStore} from '../../../../stores/tasks/task-store';
import {DeleteModal} from '../../../tools/delete-modal/delete-modal';

@Component({
    selector: 'app-task-card',
    standalone: true,
    imports: [
        RouterLink,
        DeleteModal
    ],
    templateUrl: './task-card.html',
    styleUrl: './task-card.css',
})
export class TaskCard {
    task: InputSignal<Task> = input.required<Task>();

    #taskStore = inject(TaskStore);
    #router: Router = inject(Router);
    #route: ActivatedRoute = inject(ActivatedRoute);

    showDeleteModal = signal<boolean>(false);

    updateTask(event: Event): void {
        event.stopPropagation();
        this.#router.navigate(['update', this.task().id], { relativeTo: this.#route });
    }

    deleteTask(event: Event): void {
        event.stopPropagation();
        this.showDeleteModal.set(true);
    }

    confirmDeleteTask() {
        this.showDeleteModal.set(false);
        this.#taskStore.deleteTaskById(this.task().id);
    }

    cancelDeleteTask() {
        this.showDeleteModal.set(false);
    }
}
