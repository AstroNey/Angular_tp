import {Component, inject, linkedSignal, Signal} from '@angular/core';
import {TaskList} from '../tasks/task-list/task-list';
import {TaskStore} from '../../stores/TaskStore';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {State} from '../../models/state/State';

@Component({
  selector: 'app-kanban',
    standalone: true,
    imports: [
        TaskList,
        CdkDropList,
        CdkDrag,

    ],
  templateUrl: './kanban.html',
  styleUrl: './kanban.css',
})
export class Kanban {
    taskStore = inject(TaskStore);
    readonly gridColumns: Signal<string> = linkedSignal(() => `repeat(${this.taskStore.stateColumns()}, minmax(0, 1fr))`);

    dropState(event: CdkDragDrop<State[]>) {
        const draggedItem = event.item.data;
        if (draggedItem && draggedItem.hasOwnProperty('state')) {
            const currentStates = this.taskStore.states();
            const newStatesOrder = [...currentStates];
            moveItemInArray(newStatesOrder, event.previousIndex, event.currentIndex);
            this.taskStore.updateStatesOrder(newStatesOrder);
        }
    }
}
