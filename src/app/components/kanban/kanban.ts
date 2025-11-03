import {Component, computed, inject, InputSignal, Signal} from '@angular/core';
import {TaskCard} from '../tasks/task-list/task-card/task-card';
import {TaskList} from '../tasks/task-list/task-list';
import {TaskStore} from '../../stores/TaskStore';

@Component({
  selector: 'app-kanban',
    imports: [
        TaskList
    ],
  templateUrl: './kanban.html',
  styleUrl: './kanban.css',
})
export class Kanban {
    taskStore = inject(TaskStore);
    readonly gridColumns: Signal<string> = computed(() => this.taskStore.stateColumns());
}
