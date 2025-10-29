import {Component, inject} from '@angular/core';
import {TaskService} from '../../../services/task/task-service';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import { TaskCard } from "./task-card/task-card";
import { TaskDetails } from "../task-details/task-details";

@Component({
    selector: 'app-task-list-component',
    standalone: true,
    imports: [
        TaskCard,
        TaskDetails,
        RouterOutlet
    ],
    templateUrl: './task-list.html',
    styleUrl: './task-list.css',
})
export class TaskList {
    #taskService = inject(TaskService);
    #route = inject(ActivatedRoute);
    #router: Router = inject(Router);

    readonly tasksRessource = this.#taskService.getTasks();
    readonly taskId = this.#route.snapshot.paramMap.get('id') as string;

    public createTask(): void {
        this.#router.navigate(['create'], { relativeTo: this.#route });
    }
}
