import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../services/component/toast-service';
import { UserResponse } from '../../interfaces/user/user-response';
import { UserService } from '../../services/component/user-service';
import { RegisterRequest } from '../../interfaces/user/register-request';
import { UserRole } from '../../interfaces/user/user-role';
import { AuthService } from '../../services/component/auth-service';
import { Router } from '@angular/router';
import { ChangePasswordRequest } from '../../interfaces/user/change-password-request';

interface BackendViolation {
    field: string;
    message: string;
}

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './accounts.html',
  styleUrl: './accounts.scss',
})

export class Accounts {
    private userService = inject(UserService);
    private authService = inject(AuthService);
    private formBuilder = inject(FormBuilder);
    private toast = inject(ToastService);
    private router = inject(Router);

    currentUser = this.userService.currentUser;
    isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');

    users = signal<UserResponse[]>([]);
    isLoading = signal(false);
    isModalOpen = signal(false);
    isChangePasswordOpen = signal(false);
    modalError = signal<string>('');
    userToDelete = signal<string | null>(null);
    userToReset = signal<string | null>(null);


    resetPasswordControl = this.formBuilder.control('', [Validators.required, Validators.minLength(8)]);

    createAccountForm = this.formBuilder.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        role: ['CLINICIAN' as UserRole, Validators.required]
    });

    changePasswordForm = this.formBuilder.group({
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
    });

    constructor() {
        if(this.isAdmin()) {
            this.loadUsers();
        }
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/']);
    }

    changePassword() {

    }

    loadUsers() {
        this.isLoading.set(true);
        this.userService.listUsers().subscribe({
            next: (data) => {
                this.users.set(data);
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
        });
    }

    openModal() {
        this.isModalOpen.set(true);
        this.createAccountForm.reset({ role: 'CLINICIAN' as UserRole });
        this.modalError.set('');
    }

    closeModal() {
        this.isModalOpen.set(false);
    }

    onSubmit() {
        if(this.createAccountForm.invalid) return;

        const payload = this.createAccountForm.getRawValue();

        this.userService.createUser(payload as RegisterRequest).subscribe({
            next: () => {
                this.loadUsers();
                this.closeModal();
                this.toast.show('User created successfully!', 'success');
            },
            error: (error: HttpErrorResponse) => {
                if(error.status === 409) {
                    this.modalError.set('That username is already taken.');
                    return;
                }
                if(error.status === 400 && error.error.violations) {
                    const messages = (error.error.violations as BackendViolation[])
                                    .map(v => v.message)
                                    .join(' ');
                    this.modalError.set(messages);
                    return;
                }
                this.modalError.set('Failed to create user. Please try again.');
            }
        });
    }

    initiateDelete(username: string) {
        this.userToDelete.set(username);
    }

    confirmDelete() {
        const username = this.userToDelete();
        if(!username) return;

        this.userService.deleteUser(username).subscribe({
            next: () => {
                this.loadUsers();
                this.userToDelete.set(null);
                this.toast.show(`User ${username} deleted.`, 'success');
            },
            error: () => {
                this.toast.show('Failed to delete user.', 'error');
            }
        })
    }

    cancelDelete() {
        this.userToDelete.set(null);
    }

    initiateReset(username: string) {
        this.userToReset.set(username);
        this.resetPasswordControl.reset();
    }

    cancelReset() {
        this.userToReset.set(null);
    }

    confirmReset() {
        if (this.resetPasswordControl.invalid) return;

        const username = this.userToReset();
        const newPassword = this.resetPasswordControl.value!;

        if(username) {
            this.userService.forceResetPassword(username, {newPassword}).subscribe({
                next: () => {
                    this.toast.show(`Password for ${username} reset successfully.`, 'success');
                    this.cancelReset();
                },
                error: () => {
                    this.toast.show('Failed to reset password.', 'error');
                }
            });
        }
    }

    openChangePassword() {
        this.isChangePasswordOpen.set(true);
        this.changePasswordForm.reset();
        this.modalError.set('');
    }

    closeChangePassword() {
        this.isChangePasswordOpen.set(false);
    }

    onChangePasswordSubmit() {
        if (this.changePasswordForm.invalid) return;

        const { oldPassword, newPassword, confirmPassword } = this.changePasswordForm.getRawValue();

        // 1. Frontend Validation: Passwords match
        if (newPassword !== confirmPassword) {
            this.modalError.set("New passwords do not match.");
            return;
        }

        const payload: ChangePasswordRequest = {
            oldPassword: oldPassword!,
            newPassword: newPassword!
        };

        this.userService.changePassword(payload).subscribe({
            next: () => {
                this.toast.show('Password changed successfully.', 'success');
                this.closeChangePassword();
            },
            error: (error: HttpErrorResponse) => {
                if (error.status === 401 || error.status === 403) {
                    this.modalError.set('Current password is incorrect.');
                } else {
                    this.modalError.set('Failed to update password.');
                }
            }
        });
    }
}
