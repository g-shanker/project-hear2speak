import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { AppointmentResponse } from "../interfaces/appointment-response";
import { AppointmentSearchRequest } from "../interfaces/appointment-search-request";
import { ClinicianAppointmentRequest } from "../interfaces/clinician-appointment-request";
import { PatientAppointmentRequest } from "../interfaces/patient-appointment-request";

@Injectable({
    providedIn: 'root'
})

export class AppointmentApiService {
    private http = inject(HttpClient);
    private apiUrl  = '/api/appointments'

    clinicianCreate(appointment: ClinicianAppointmentRequest): Observable<AppointmentResponse> {
        return this.http.post<AppointmentResponse>(`${this.apiUrl}/clinician`, appointment);
    }

    patientCreate(appointment: PatientAppointmentRequest): Observable<AppointmentResponse> {
        return this.http.post<AppointmentResponse>(`${this.apiUrl}/patient`, appointment);
    }

    update(id: number, appointment: ClinicianAppointmentRequest): Observable<AppointmentResponse> {
        return this.http.put<AppointmentResponse>(`${this.apiUrl}/${id}`, appointment);
    }

    getAll(): Observable<AppointmentResponse[]> {
        return this.http.get<AppointmentResponse[]>(this.apiUrl);
    }

    search(searchRequest: AppointmentSearchRequest | null): Observable<AppointmentResponse[]> {
        return this.http.post<AppointmentResponse[]>(`${this.apiUrl}/search`, searchRequest);
    }
}