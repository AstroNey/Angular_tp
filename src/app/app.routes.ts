import {Routes} from '@angular/router';
import {Kanban} from './components/kanban/kanban';

export const routes: Routes = [
    {path: '', redirectTo: 'tasks', pathMatch: 'full'},
    {
        path: 'tasks',
        component: Kanban
    },
    {
        path: 'tasks/details/:id',
        loadComponent: () =>
            import(
                "./components/kanban/kanban"
                ).then((m) => m.Kanban),
    },
    {
        path: 'tasks/update/:id',
        loadComponent: () =>
            import(
                "./components/tasks/task-form/task-form"
                ).then((m) => m.TaskForm),
    },
    {
        path: 'tasks/create',
        loadComponent: () =>
            import(
                "./components/tasks/task-form/task-form"
                ).then((m) => m.TaskForm),
    }
];
