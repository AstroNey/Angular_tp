import { Routes } from '@angular/router';
import {TaskList} from './components/tasks/task-list/task-list';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'tasks', component: TaskList },
];
