import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LoginRequest } from "../../interfaces/auth/login-request";
import { TokenResponse } from "../../interfaces/auth/token-response";

import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class AuthApiService {
    private http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl + '/api/auth';

    login(request: LoginRequest): Observable<TokenResponse> {
        return this.http.post<TokenResponse>(`${this.apiUrl}/login`, request);
    }
}