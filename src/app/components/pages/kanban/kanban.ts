import {Component, inject, linkedSignal, signal, Signal, WritableSignal} from '@angular/core';
import {TaskList} from '../../tasks/task-list/task-list';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {State} from '../../../models/state/State';
import {RouterLink} from '@angular/router';
import {Navbar} from '../../tools/navbar/navbar';
import {StateStore} from '../../../stores/states/state-store';

@Component({
  selector: 'app-kanban',
    standalone: true,
    imports: [
        TaskList,
        CdkDropList,
        CdkDrag,
        RouterLink,
        Navbar,
        Navbar,
    ],
  templateUrl: './kanban.html',
  styleUrl: './kanban.css',
})
export class Kanban {
    isModalOpen: WritableSignal<boolean> = signal(false);

    stateStore = inject(StateStore);
    readonly gridColumns: Signal<string> = linkedSignal(() => `repeat(${this.stateStore.stateColumns()}, minmax(0, 320px))`);

    dropState(event: CdkDragDrop<State[]>): void {
        const draggedItem: any = event.item.data;
        if (draggedItem && draggedItem.hasOwnProperty('state')) {
            const currentStates: State[] = this.stateStore.states();
            const newStatesOrder: State[] = [...currentStates];
            moveItemInArray(newStatesOrder, event.previousIndex, event.currentIndex);
            this.stateStore.updateStatesOrder(newStatesOrder);
        }
    }
}
