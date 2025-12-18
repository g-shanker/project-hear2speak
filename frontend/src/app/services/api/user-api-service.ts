import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CreateAppointmentRequest } from "../../interfaces/appointment/create-appointment-request";
import { Observable } from "rxjs";
import { AppointmentResponse } from "../../interfaces/appointment/appointment-response";
import { UpdateAppointmentRequest } from "../../interfaces/appointment/update-appointment-request";
import { AppointmentSearchRequest } from "../../interfaces/appointment/appointment-search-request";
import { UserResponse } from "../../interfaces/user/user-response";
import { ChangePasswordRequest } from "../../interfaces/user/change-password-request";
import { RegisterRequest } from "../../interfaces/user/register-request";
import { ForceResetPasswordRequest } from "../../interfaces/user/force-reset-password-request";

import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class UserApiService {
    private http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl + '/api/users'

    getCurrentUser(): Observable<UserResponse> {
        return this.http.get<UserResponse>(`${this.apiUrl}/me`);
    }

    changePassword(request: ChangePasswordRequest) {
        return this.http.put(`${this.apiUrl}/me/reset-password`, request);
    }

    listUsers(): Observable<UserResponse[]> {
        return this.http.get<UserResponse[]>(`${this.apiUrl}`);
    }

    createUser(request: RegisterRequest) {
        return this.http.post(`${this.apiUrl}`, request);
    }

    deleteUser(username: string) {
        return this.http.delete(`${this.apiUrl}/${username}`);
    }

    forceResetPassword(username: string, request: ForceResetPasswordRequest) {
        return this.http.put(`${this.apiUrl}/${username}/reset-password`, request);
    }
}