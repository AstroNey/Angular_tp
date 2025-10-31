import {Component, inject, OnInit} from '@angular/core';
import {NgClass} from '@angular/common';
import {TaskService} from '../../../services/task/task-service';
import {ActivatedRoute, Router} from '@angular/router';
import { HttpResourceRef } from "@angular/common/http";

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
    #taskService: TaskService = inject(TaskService);
    #route: ActivatedRoute = inject(ActivatedRoute);
    #router: Router = inject(Router);

    readonly taskId: string = this.#route.snapshot.paramMap.get('id') as string;
    readonly taskRessource: HttpResourceRef<any> | undefined = this.#taskService.getTask(this.taskId);

    protected closeDetails(): void {
        this.#router.navigate(['../../'], { relativeTo: this.#route });
    }
}
