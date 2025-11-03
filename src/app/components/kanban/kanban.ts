import {Component, computed, inject, InputSignal, linkedSignal, Signal} from '@angular/core';
import {TaskCard} from '../tasks/task-list/task-card/task-card';
import {TaskList} from '../tasks/task-list/task-list';
import {TaskStore} from '../../stores/TaskStore';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-kanban',
    imports: [
        TaskList,
        NgClass
    ],
  templateUrl: './kanban.html',
  styleUrl: './kanban.css',
})
export class Kanban {
    taskStore = inject(TaskStore);
    readonly gridColumns: Signal<string> = linkedSignal(() => `grid grid-cols-${this.taskStore.stateColumns()} gap-2`);
}
