import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PatientAppointmentRequest } from '../interfaces/patient-appointment-request';
import { AppointmentResponse } from '../interfaces/appointment-response';
import { ClinicianAppointmentRequest } from '../interfaces/clinician-appointment-request';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = '/api/appointments';

  constructor(private http: HttpClient) {}

  createAppointment(appointment: PatientAppointmentRequest): Observable<PatientAppointmentRequest> {
    return this.http.post<PatientAppointmentRequest>(this.apiUrl, appointment);
  }

  updateAppointment(appointmentId: number, appointment: ClinicianAppointmentRequest): Observable<ClinicianAppointmentRequest> {
    return this.http.put<ClinicianAppointmentRequest>(`${this.apiUrl}/${appointmentId}`, appointment);
  }

  getAllAppointments(): Observable<AppointmentResponse[]> {
    return this.http.get<AppointmentResponse[]>(this.apiUrl);
  }
}