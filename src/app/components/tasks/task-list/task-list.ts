import {
    Component,
    effect,
    inject,
    input,
    InputSignal,
    linkedSignal,
    model,
    ModelSignal, OnInit, signal,
    WritableSignal
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskCard} from "./task-card/task-card";
import {TaskDetails} from "../task-details/task-details";
import {TaskStore} from '../../../stores/tasks/task-store';
import {Task} from '../../../models/task/Task';
import {CdkDrag, CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';
import {State} from '../../../models/state/State';
import {StateStore} from '../../../stores/states/state-store';
import {DeleteModal} from '../../tools/delete-modal/delete-modal';

@Component({
    selector: 'app-task-list-component',
    standalone: true,
    imports: [
        TaskCard,
        TaskDetails,
        CdkDropList,
        CdkDrag,
        DeleteModal
    ],
    templateUrl: './task-list.html',
    styleUrl: './task-list.css',
})
export class TaskList {
    #route: ActivatedRoute = inject(ActivatedRoute);
    #router: Router = inject(Router);
    taskStore = inject(TaskStore);
    stateStore = inject(StateStore);

    readonly taskId: string = this.#route.snapshot.paramMap.get('id') as string;
    modalOpen: ModelSignal<boolean> = model(false);

    readonly state: InputSignal<State> = input.required();
    tasksInThisColumn: WritableSignal<Task[]> = linkedSignal(() => {
        const state: string = this.state().state;
        return this.taskStore.tasksByState()[state] ?? [];
    });

    showDeleteModal = signal<boolean>(false);

    constructor() {
        effect((): void => {
            this.modalOpen.set(!!this.taskId);
        });
    }

    confirmDeleteState() {
        this.showDeleteModal.set(false);
        this.stateStore.deleteStateById(this.state().id);
    }

    cancelDeleteState() {
        this.showDeleteModal.set(false);
    }

    connectedDropLists(): string[] {
        return this.stateStore.states().map(state => state.state);
    }

    public createTask(): void {
        this.#router.navigate(['create'], { relativeTo: this.#route });
    }

    public deleteState(event: Event): void {
        event.stopPropagation();
        this.showDeleteModal.set(true);
    }

    dropTask(event: CdkDragDrop<Task[], Task[], any>): void {
        const movedTask: Task = event.item.data;
        if (event.previousContainer === event.container) {
            this.taskStore.updateTaskOrder({
                taskId: movedTask.id,
                newIndex: event.currentIndex,
                newStatus: event.container.id
            });
        } else {
            this.taskStore.transferTask({
                taskId: movedTask.id,
                newStatus: event.container.id,
                newIndex: event.currentIndex
            });
        }
    }
}
