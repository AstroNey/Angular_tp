import {Routes} from '@angular/router';
import {Kanban} from './components/pages/kanban/kanban';
import {Login} from './components/pages/login/login';
import {authGuard} from './services/auth.guard';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {
        path: 'login',
        component: Login
    },
    {
        path: 'tasks',
        component: Kanban,
        canActivate: [authGuard]
    },
    {
        path: 'tasks/details/:id',
        loadComponent: () =>
            import(
                "./components/pages/kanban/kanban"
                ).then((m) => m.Kanban),
        canActivate: [authGuard]
    },
    {
        path: 'tasks/update/:id',
        loadComponent: () =>
            import(
                "./components/tasks/task-form/task-form"
                ).then((m) => m.TaskForm),
        canActivate: [authGuard]
    },
    {
        path: 'tasks/create',
        loadComponent: () =>
            import(
                "./components/tasks/task-form/task-form"
                ).then((m) => m.TaskForm),
        canActivate: [authGuard]
    }
];
