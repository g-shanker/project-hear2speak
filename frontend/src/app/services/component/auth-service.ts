import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from './user-service';
import { AuthApiService } from '../api/auth-api-service';
import { UserResponse } from '../../interfaces/user/user-response';
import { LoginRequest } from '../../interfaces/auth/login-request';
import { computed, inject, Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})

export class AuthService {
    private router = inject(Router);
    private api = inject(AuthApiService);
    private userService = inject(UserService);

    private readonly tokenKey = 'jwt_token';

    isLoggedIn = computed(() => !!this.userService.currentUser);

    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        if (this.isTokenExpired(token)) {
            this.logout();
            return false;
        }

        return true;
    }

    // --- 2. HELPER TO CHECK EXPIRATION ---
    private isTokenExpired(token: string): boolean {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));
            const nowInSeconds = Math.floor(Date.now() / 1000);
            return nowInSeconds >= payload.exp;
        } catch (e) {
            return true;
        }
    }

    constructor() {
        this.tryAutoLogin();
    }

    private tryAutoLogin(): void {
        const token = this.getToken();
        if (!token) return;

        this.userService.getCurrentUser().subscribe({
            error: () => {
                this.logout();
            }
        });
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        this.userService.setCurrentUser(null);
        // this.router.navigate(['/login']);
    }

    login(request: LoginRequest) {
        return this.api.login(request).pipe(
            tap(token => {
                localStorage.setItem(this.tokenKey, token.token);
                this.userService.getCurrentUser();
            }),
        );
    }

}
