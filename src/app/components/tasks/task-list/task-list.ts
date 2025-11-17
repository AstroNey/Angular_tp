import {Component, effect, inject, input, InputSignal, linkedSignal, model, WritableSignal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskCard} from "./task-card/task-card";
import {TaskDetails} from "../task-details/task-details";
import {TaskStore} from '../../../stores/task-store';
import {Task} from '../../../models/task/Task';
import {NgClass} from '@angular/common';
import {CdkDrag, CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';
import {State} from '../../../models/state/State';

@Component({
    selector: 'app-task-list-component',
    standalone: true,
    imports: [
        TaskCard,
        TaskDetails,
        CdkDropList,
        CdkDrag
    ],
    templateUrl: './task-list.html',
    styleUrl: './task-list.css',
})
export class TaskList {
    #route = inject(ActivatedRoute);
    #router: Router = inject(Router);
    taskStore = inject(TaskStore);

    readonly taskId = this.#route.snapshot.paramMap.get('id') as string;
    modalOpen = model(false);

    readonly state: InputSignal<State> = input.required();
    tasksInThisColumn: WritableSignal<Task[]> = linkedSignal(() => {
        const state: string = this.state().state;
        return this.taskStore.tasksByState()[state] ?? [];
    });

    constructor() {
        effect(() => {
            this.modalOpen.set(!!this.taskId);
        });
    }

    public createTask(): void {
        this.#router.navigate(['create'], { relativeTo: this.#route });
    }

    public deleteState($event: Event): void {
        $event.stopPropagation();
        this.taskStore.deleteStateById(this.state().id);
    }

    connectedDropLists(): string[] {
        return this.taskStore.states().map(state => state.state);
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
