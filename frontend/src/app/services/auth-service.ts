import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserResponse } from '../interfaces/user-response';
import { LoginRequest } from '../interfaces/login-request';
import { TokenResponse } from '../interfaces/token-response';
import { switchMap, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);

    private readonly apiUrl = '/api/auth';
    private readonly tokenKey = 'jwt_token';

    currentUser = signal<UserResponse | null>(null);
    isLoggedIn = computed(() => !!this.currentUser());

    constructor() {
      // When the app starts, check if we have a token saved
      this.tryAutoLogin();
    }

    login(credentials: LoginRequest) {
        return this.http.post<TokenResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                localStorage.setItem(this.tokenKey, response.token);
                this.fetchCurrentUser().subscribe();
            }),
            switchMap(() => this.fetchCurrentUser())
        );
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    private tryAutoLogin() {
        const token = this.getToken();
        if(!token) return;

        this.fetchCurrentUser().subscribe({
            error: () => {
                this.logout();
            }
        });
    }

    private fetchCurrentUser() {
        return this.http.get<UserResponse>(`${this.apiUrl}/me`).pipe(
            tap(user => this.currentUser.set(user))
        );
    }
}
