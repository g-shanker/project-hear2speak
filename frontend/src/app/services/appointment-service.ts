import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PatientAppointmentRequest } from '../interfaces/patient-appointment-request';
import { AppointmentResponse } from '../interfaces/appointment-response';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = '/api/appointments';

  constructor(private http: HttpClient) {}

  createAppointment(appointment: PatientAppointmentRequest): Observable<PatientAppointmentRequest> {
    return this.http.post<PatientAppointmentRequest>(this.apiUrl, appointment);
  }

  getAllAppointments(): Observable<AppointmentResponse[]> {
    return this.http.get<AppointmentResponse[]>(this.apiUrl);
  }
}