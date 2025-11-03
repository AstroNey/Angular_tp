import {Component, inject, input, InputSignal, linkedSignal, WritableSignal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskCard} from "./task-card/task-card";
import {TaskDetails} from "../task-details/task-details";
import {TaskStore} from '../../../stores/TaskStore';
import {Task} from '../../../models/task/Task';

@Component({
    selector: 'app-task-list-component',
    standalone: true,
    imports: [
        TaskCard,
        TaskDetails
    ],
    templateUrl: './task-list.html',
    styleUrl: './task-list.css',
})
export class TaskList {
    #route = inject(ActivatedRoute);
    #router: Router = inject(Router);
    #taskStore = inject(TaskStore);

    readonly taskId = this.#route.snapshot.paramMap.get('id') as string;
    readonly state: InputSignal<string> = input.required();
    tasks: WritableSignal<Task[]> = linkedSignal(() => {
        return this.#taskStore.tasks().filter(task => task.state.state === this.state()) ?? [];
    });

    public createTask(): void {
        this.#router.navigate(['create'], { relativeTo: this.#route });
    }
}
