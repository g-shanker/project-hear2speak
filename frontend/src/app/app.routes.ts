import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Admin } from './pages/admin/admin';
import { authGuard } from './guards/auth-guard';
import { Login } from './pages/login/login';

export const routes: Routes = [
    {
        path: '',
        component: Home,
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'admin',
        component: Admin,
        canActivate: [authGuard],
        children: []
    },
    {
        path: '**',
        redirectTo: '/'
    }
];
