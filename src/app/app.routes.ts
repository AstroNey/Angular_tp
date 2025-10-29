import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/tasks', pathMatch: 'full' },
    {
        path: '/tasks',
        loadComponent: () =>
            import(
                "./components/tasks/task-list/task-list"
                ).then((m) => m.TaskList)
    },
    {
        path: '/tasks/details/:id',
        loadComponent: () =>
            import(
                "./components/tasks/task-details/task-details"
                ).then((m) => m.TaskDetails),
    }
];
