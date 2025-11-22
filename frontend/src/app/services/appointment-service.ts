import { Observable } from 'rxjs';
import { AppointmentApiService } from './appointment-api-service';
import { inject, Injectable, signal, Signal } from '@angular/core';
import { AppointmentResponse } from '../interfaces/appointment-response';
import { AppointmentSearchRequest } from '../interfaces/appointment-search-request';
import { ClinicianAppointmentRequest } from '../interfaces/clinician-appointment-request';

@Injectable({
    providedIn: 'root'
})

export class AppointmentService {
    private api = inject(AppointmentApiService);

    private _isLoading = signal(false);
    private _errorMessage = signal<string | null>(null);
    private _searchResults = signal<AppointmentResponse[]>([]);
    private _selectedAppointment = signal<AppointmentResponse | null>(null);
    
    readonly searchResults = this._searchResults.asReadonly();
    readonly isLoading = this._isLoading.asReadonly();
    readonly errorMessage = this._errorMessage.asReadonly();
    readonly selectedAppointment = this._selectedAppointment.asReadonly();

    selectAppointment(appointment: AppointmentResponse): void {
        if(!appointment.isAcknowledged) {
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
    
    searchAppointments(searchRequest: AppointmentSearchRequest): void {
        this._isLoading.set(true);
        this._errorMessage.set(null);
        
        this.api.search(searchRequest).subscribe({
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

    updateAppointment(id: number, appointment: ClinicianAppointmentRequest): Observable<ClinicianAppointmentRequest> {
        return this.api.update(id, appointment)
    }

    createAppointment(appointment: ClinicianAppointmentRequest): Observable<ClinicianAppointmentRequest> {
        return this.api.create(appointment);
    }
}