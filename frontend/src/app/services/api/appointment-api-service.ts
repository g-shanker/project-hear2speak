import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CreateAppointmentRequest } from "../../interfaces/appointment/create-appointment-request";
import { Observable } from "rxjs";
import { AppointmentResponse } from "../../interfaces/appointment/appointment-response";
import { UpdateAppointmentRequest } from "../../interfaces/appointment/update-appointment-request";
import { AppointmentSearchRequest } from "../../interfaces/appointment/appointment-search-request";

import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class AppointmentApiService {
    private http = inject(HttpClient);
    private readonly apiUrl =  environment.apiUrl + '/api/appointments'

    createAppointment(appointment: CreateAppointmentRequest): Observable<AppointmentResponse> {
        return this.http.post<AppointmentResponse>(`${this.apiUrl}`, appointment);
    }

    updateAppointment(id: number, appointment: UpdateAppointmentRequest): Observable<AppointmentResponse> {
        return this.http.put<AppointmentResponse>(`${this.apiUrl}/${id}`, appointment);
    }

    deleteAppointment(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    searchAppointments(searchRequest: AppointmentSearchRequest): Observable<AppointmentResponse[]> {
        return this.http.post<AppointmentResponse[]>(`${this.apiUrl}/search`, searchRequest);
    }
}