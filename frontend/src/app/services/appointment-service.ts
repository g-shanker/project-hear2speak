import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppointmentResponse } from '../interfaces/appointment-response';
import { PatientAppointmentRequest } from '../interfaces/patient-appointment-request';
import { ClinicianAppointmentRequest } from '../interfaces/clinician-appointment-request';

@Injectable({
    providedIn: 'root'
})

export class AppointmentService {
    private apiUrl = '/api/appointments';

    private appointmentUpdatedSource = new BehaviorSubject<AppointmentResponse | null>(null);
    appointmentUpdated$ = this.appointmentUpdatedSource.asObservable();
    notifyUpdated(appointment: AppointmentResponse) {
        this.appointmentUpdatedSource.next(appointment);
    }

    private appointmentSelectedSource = new BehaviorSubject<AppointmentResponse | null>(null);
    appointmentSelected$ = this.appointmentSelectedSource.asObservable();
    notifySelected(appointment: AppointmentResponse) {
        this.appointmentSelectedSource.next(appointment);
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
}