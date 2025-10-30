import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home';
import { AdminPage } from './pages/admin/admin';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: HomePage,
    },
    {
        path: 'admin',
        component: AdminPage
    }
];
