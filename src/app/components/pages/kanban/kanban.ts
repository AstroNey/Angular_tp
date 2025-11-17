import {Component, inject, linkedSignal, signal, Signal, WritableSignal} from '@angular/core';
import {TaskList} from '../../tasks/task-list/task-list';
import {TaskStore} from '../../../stores/task-store';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {State} from '../../../models/state/State';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-kanban',
    standalone: true,
    imports: [
        TaskList,
        CdkDropList,
        CdkDrag,
        RouterLink,
    ],
  templateUrl: './kanban.html',
  styleUrl: './kanban.css',
})
export class Kanban {
    isModalOpen: WritableSignal<boolean> = signal(false);

    taskStore = inject(TaskStore);
    readonly gridColumns: Signal<string> = linkedSignal(() => `repeat(${this.taskStore.stateColumns()}, minmax(0, 320px))`);

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
