import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/tasks', pathMatch: 'full' },
    {
        path: 'tasks',
        loadComponent: () =>
            import(
                "./components/tasks/task-list/task-list"
                ).then((m) => m.TaskList)
    },
    {
        path: 'tasks/details/:id',
        loadComponent: () =>
            import(
                "./components/tasks/task-list/task-list"
                ).then((m) => m.TaskList),
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
