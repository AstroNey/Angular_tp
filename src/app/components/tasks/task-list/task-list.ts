import {Component, inject} from '@angular/core';
import {TaskService} from '../../../services/task/task-service';
import {RouterOutlet} from '@angular/router';
import { TaskCard } from "./task-card/task-card";

@Component({
    selector: 'app-task-list-component',
    standalone: true,
    imports: [
        TaskCard,
        RouterOutlet
    ],
    templateUrl: './task-list.html',
    styleUrl: './task-list.css',
})
export class TaskList {
  #taskService = inject(TaskService);

  readonly tasksRessource = this.#taskService.getTasks();
}
