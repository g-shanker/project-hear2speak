import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/component/auth-service';
import { LoginRequest } from '../../interfaces/auth/login-request';
import { UserService } from '../../services/component/user-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})

export class Login {
    private formBuilder = inject(FormBuilder);
    private authService = inject(AuthService);
    private userService = inject(UserService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    loginForm = this.formBuilder.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]]
    });

    errorMessage = signal<string>('');
    isLoading = signal<boolean>(false);

    onSubmit() {
        if(this.loginForm.invalid) return;

        this.isLoading.set(true);
        this.errorMessage.set('');

        const { username, password } = this.loginForm.getRawValue();
        const payload: LoginRequest = {
            username: username!,
            password: password!
        }

        this.authService.login(payload).subscribe({
            next: () => {
                this.isLoading.set(false);
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
                this.userService.getCurrentUser().subscribe({
                    next: (user) => {
                        console.log('Got current user details successfully!');
                    },
                    error: (error) => {
                        console.error('Error while fetching current user details.');
                    }
                })
                this.router.navigateByUrl(returnUrl);
            },
            error: (error) => {
                this.isLoading.set(false);
                if(error.status === 401) {
                    this.errorMessage.set('Invalid username or password');
                }
                else {
                    this.errorMessage.set('Something went wrong. Is the server running?');
                }
            }
        });
    }
}
