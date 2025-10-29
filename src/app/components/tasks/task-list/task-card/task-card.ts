import {Component, input} from '@angular/core';
import {NgClass} from '@angular/common';
import {RouterLink} from '@angular/router';
import { Task } from "../../../../models/task/Task";

@Component({
    selector: 'app-task-card',
    standalone: true,
    imports: [
        NgClass,
        RouterLink
    ],
    templateUrl: './task-card.html',
    styleUrl: './task-card.css',
})
export class TaskCard {
    task = input.required<Task>();
}
