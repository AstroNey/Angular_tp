import {Component, inject, OnInit} from '@angular/core';
import {NgClass} from '@angular/common';
import {TaskService} from '../../../services/task/task-service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-task-details',
    standalone: true,
    imports: [
        NgClass
    ],
    templateUrl: './task-details.html',
    styleUrl: './task-details.css',
})
export class TaskDetails {
    #taskService = inject(TaskService);
    #route = inject(ActivatedRoute);
    #router = inject(Router);

    readonly taskId = this.#route.snapshot.paramMap.get('id') as string;
    readonly taskRessource = this.#taskService.getTask(this.taskId);

    protected closeDetails() {
        this.#router.navigate(['../../'], { relativeTo: this.#route });
    }
}
