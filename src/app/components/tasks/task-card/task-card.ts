import {Component, input} from '@angular/core';
import {Task} from '../../../models/task/Task';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-task-card',
    imports: [
        NgClass
    ],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css',
})
export class TaskCard {
    task = input.required<Task>();
}
