import { Observable, tap } from 'rxjs';
import { AppointmentApiService } from './appointment-api-service';
import { inject, Injectable, signal, Signal } from '@angular/core';
import { AppointmentResponse } from '../interfaces/appointment-response';
import { AppointmentSearchRequest } from '../interfaces/appointment-search-request';
import { ClinicianAppointmentRequest } from '../interfaces/clinician-appointment-request';
import { PatientAppointmentRequest } from '../interfaces/patient-appointment-request';

@Injectable({
    providedIn: 'root'
})

export class AppointmentService {
    private api = inject(AppointmentApiService);

    private _isLoading = signal(false);
    private _errorMessage = signal<string | null>(null);
    private _searchResults = signal<AppointmentResponse[]>([]);
    private _selectedAppointment = signal<AppointmentResponse | null>(null);

    private _currentSearchRequest = signal<AppointmentSearchRequest>({
        globalText: null,
        appointmentStatus: null,
        startDateFrom: null,
        startDateTo: null,
        sortField: 'createdAt',
        ascending: false
    });
    
    readonly searchResults = this._searchResults.asReadonly();
    readonly isLoading = this._isLoading.asReadonly();
    readonly errorMessage = this._errorMessage.asReadonly();
    readonly selectedAppointment = this._selectedAppointment.asReadonly();

    readonly currentSearchRequest = this._currentSearchRequest.asReadonly();

    selectAppointment(appointment: AppointmentResponse | null): void {
        if(appointment && !appointment.isAcknowledged) {
            this.acknowledgeAppointment(appointment);
        }
        this._selectedAppointment.set(appointment);
    }

    private acknowledgeAppointment(appointment: AppointmentResponse): void {
        const payload = { ...appointment, isAcknowledged: true };

        this.api.update(appointment.id, payload).subscribe({
            next: (updated) => {
                this._searchResults.update(list =>
                    list.map(a => a.id === updated.id ? updated : a)
                );
                this._selectedAppointment.set(appointment);
            },
            error: (error) => console.error(error)
        })
    }
    
    searchAppointments(partialSearchRequest: Partial<AppointmentSearchRequest>): void {
        this._isLoading.set(true);
        this._errorMessage.set(null);

        this._currentSearchRequest.update(current => ({
            ...current,
            ...partialSearchRequest
        }));

        const finalRequest = this._currentSearchRequest();
        
        this.api.search(finalRequest).subscribe({
            next: (searchResults) => {
                this._searchResults.set(searchResults);
                this._isLoading.set(false);
            },
            error: (error) => {
                this._errorMessage.set('Failed to search for appointments.');
                this._isLoading.set(false);
            }
        })
    }

    updateAppointment(id: number, appointment: ClinicianAppointmentRequest): Observable<AppointmentResponse> {
        return this.api.update(id, appointment).pipe(
            tap((updatedAppointment) => {
                this._searchResults.update(currentList =>
                    currentList.map(appointment =>
                        appointment.id === id ? updatedAppointment : appointment
                    )
                );

                if(this._selectedAppointment()?.id === id) {
                    this._selectedAppointment.set(updatedAppointment);
                }
            })
        );
    }

    createClinicianAppointment(appointment: ClinicianAppointmentRequest): Observable<AppointmentResponse> {
        return this.api.clinicianCreate(appointment).pipe(
            tap((createdAppointment: AppointmentResponse) => {
                this._searchResults.update(currentList => {
                    return [...currentList, createdAppointment];
                });
            })
        );
    }

    createPatientAppointment(appointment: PatientAppointmentRequest): Observable<AppointmentResponse> {
        return this.api.patientCreate(appointment).pipe(
            tap((createdAppointment: AppointmentResponse) => {
                this._searchResults.update(currentList => {
                    return [...currentList, createdAppointment];
                });
            })
        );
    }
}