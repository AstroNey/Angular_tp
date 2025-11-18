import {Component, computed, inject, Signal} from '@angular/core';
import {NgStyle} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskStore} from '../../../stores/tasks/task-store';
import {Task} from '../../../models/task/Task';

@Component({
    selector: 'app-task-details',
    standalone: true,
    imports: [
        NgStyle
    ],
    templateUrl: './task-details.html',
    styleUrl: './task-details.css',
})
export class TaskDetails {
    #route: ActivatedRoute = inject(ActivatedRoute);
    #router: Router = inject(Router);
    #taskStore = inject(TaskStore);

    readonly taskId: string = this.#route.snapshot.paramMap.get('id') as string;
    readonly task: Signal<Task | undefined> = computed((): Task | undefined => this.#taskStore.getTaskById(Number(this.taskId)));

    protected closeDetails(): void {
        this.#router.navigate(['../../'], { relativeTo: this.#route });
    }
}
