import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppointmentResponse } from '../interfaces/appointment-response';
import { PatientAppointmentRequest } from '../interfaces/patient-appointment-request';
import { ClinicianAppointmentRequest } from '../interfaces/clinician-appointment-request';
import { AppointmentSearchRequest } from '../interfaces/appointment-search-request';

@Injectable({
    providedIn: 'root'
})

export class AppointmentService {
    private apiUrl = '/api/appointments';

    private appointmentUpdatedSource = new BehaviorSubject<AppointmentResponse | null>(null);
    appointmentUpdated$ = this.appointmentUpdatedSource.asObservable();
    notifyAppointmentUpdated(appointment: AppointmentResponse) {
        this.appointmentUpdatedSource.next(appointment);
    }

    private appointmentSelectedSource = new BehaviorSubject<AppointmentResponse | null>(null);
    appointmentSelected$ = this.appointmentSelectedSource.asObservable();
    notifyAppointmentSelected(appointment: AppointmentResponse) {
        this.appointmentSelectedSource.next(appointment);
    }

    private searchResultsUpdatedSource = new BehaviorSubject<AppointmentResponse[] | null>(null);
    searchResultsUpdated$ = this.searchResultsUpdatedSource.asObservable();
    notifySearchResultsUpdated(searchResults: AppointmentResponse[]) {
        this.searchResultsUpdatedSource.next(searchResults);
    }

    constructor(private http: HttpClient) {}

    createAppointment(appointment: PatientAppointmentRequest): Observable<PatientAppointmentRequest> {
        return this.http.post<PatientAppointmentRequest>(this.apiUrl, appointment);
    }

    updateAppointment(appointmentId: number, appointment: ClinicianAppointmentRequest): Observable<AppointmentResponse> {
        return this.http.put<AppointmentResponse>(`${this.apiUrl}/${appointmentId}`, appointment);
    }

    getAllAppointments(): Observable<AppointmentResponse[]> {
        return this.http.get<AppointmentResponse[]>(this.apiUrl);
    }

    searchAppointments(searchRequest: AppointmentSearchRequest | null): Observable<AppointmentResponse[]> {
        return this.http.post<AppointmentResponse[]>(`${this.apiUrl}/search`, searchRequest);
    }
}