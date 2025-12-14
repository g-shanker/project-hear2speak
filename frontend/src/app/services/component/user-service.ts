import { tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { UserApiService } from "../api/user-api-service";
import { inject, Injectable, signal } from "@angular/core";
import { UserResponse } from "../../interfaces/user/user-response";
import { RegisterRequest } from "../../interfaces/user/register-request";
import { ForceResetPasswordRequest } from "../../interfaces/user/force-reset-password-request";
import { ChangePasswordRequest } from "../../interfaces/user/change-password-request";

@Injectable({
  providedIn: 'root'
})

export class UserService {
    private http = inject(HttpClient);
    private api = inject(UserApiService);

    private _currentUser = signal<UserResponse | null>(null);

    readonly currentUser = this._currentUser.asReadonly();

    setCurrentUser(user: UserResponse | null) {
        this._currentUser.set(user);
    }

    listUsers() {
        return this.api.listUsers();
    }

    createUser(request: RegisterRequest) {
        return this.api.createUser(request);
    }

    forceResetPassword(username: string, request: ForceResetPasswordRequest) {
        return this.api.forceResetPassword(username, request);
    }

    deleteUser(username: string) {
        return this.api.deleteUser(username);
    }

    getCurrentUser() {
        return this.api.getCurrentUser().pipe(
            tap(user => this.setCurrentUser(user))
        );
    }

    changePassword(request: ChangePasswordRequest) {
        return this.api.changePassword(request);
    }

}