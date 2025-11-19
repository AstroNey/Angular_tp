import {Routes} from '@angular/router';
import {Login} from './components/pages/login/login';
import {authGuard} from './services/auth.guard';

export const routes: Routes = [
    {path: '', redirectTo: 'tasks', pathMatch: 'full'},
    {
        path: 'login',
        component: Login
    },
    {
        path: 'tasks',
        canMatch: [authGuard],
        loadComponent: () =>
            import(
                "./components/pages/kanban/kanban"
                ).then((m) => m.Kanban)
    },
    {
        path: 'state/create',
        canMatch: [authGuard],
        loadComponent: () =>
            import(
                "./components/states/state-form/state-form"
                ).then((m) => m.StateForm)
    },
    {
        path: 'tasks/details/:id',
        canMatch: [authGuard],
        loadComponent: () =>
            import(
                "./components/pages/kanban/kanban"
                ).then((m) => m.Kanban)
    },
    {
        path: 'tasks/update/:id',
        canMatch: [authGuard],
        loadComponent: () =>
            import(
                "./components/tasks/task-form/task-form"
                ).then((m) => m.TaskForm)
    },
    {
        path: 'tasks/create',
        canMatch: [authGuard],
        loadComponent: () =>
            import(
                "./components/tasks/task-form/task-form"
                ).then((m) => m.TaskForm),
    }
];
