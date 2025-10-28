import {Component, inject} from '@angular/core';
import {TaskService} from '../../../services/task/task-service';
import {TaskCard} from '../task-card/task-card';

@Component({
  selector: 'app-task-list-component',
    imports: [
        TaskCard
    ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  #taskService = inject(TaskService);

  readonly tasksRessource = this.#taskService.getTasks();
}
