import {Component, inject, linkedSignal, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import {TaskList} from '../../tasks/task-list/task-list';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {State} from '../../../models/state/State';
import {RouterLink} from '@angular/router';
import {Navbar} from '../../tools/navbar/navbar';
import {StateStore} from '../../../stores/states/state-store';
import {TaskStore} from '../../../stores/tasks/task-store';

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
export class Kanban implements OnInit {
    isModalOpen: WritableSignal<boolean> = signal(false);

    stateStore = inject(StateStore);
    taskStore = inject(TaskStore);
    readonly gridColumns: Signal<string> = linkedSignal(() => `repeat(${this.stateStore.stateColumns()}, minmax(0, 270px))`);

    ngOnInit(): void {
        this.stateStore.loadStore();
        this.taskStore.loadStore();

    }

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
