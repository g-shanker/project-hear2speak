import { Observable, tap } from 'rxjs';
import { inject, Injectable, signal } from '@angular/core';
import { AppointmentApiService } from '../api/appointment-api-service';
import { AppointmentResponse } from '../../interfaces/appointment/appointment-response';
import { AppointmentSearchRequest } from '../../interfaces/appointment/appointment-search-request';
import { CreateAppointmentRequest } from '../../interfaces/appointment/create-appointment-request';
import { UpdateAppointmentRequest } from '../../interfaces/appointment/update-appointment-request';

@Injectable({
    providedIn: 'root'
})

export class AppointmentService {
    private api = inject(AppointmentApiService);

    private _isLoading = signal(false);
    private _errorMessage = signal<string | null>(null);
    private _searchResults = signal<AppointmentResponse[]>([]);
    private _searchRequest = signal<AppointmentSearchRequest | null>(null);
    private _selectedAppointment = signal<AppointmentResponse | null>(null);
    
    readonly isLoading = this._isLoading.asReadonly();
    readonly errorMessage = this._errorMessage.asReadonly();
    readonly searchResults = this._searchResults.asReadonly();
    readonly searchRequest = this._searchRequest.asReadonly();
    readonly selectedAppointment = this._selectedAppointment.asReadonly();

    selectAppointment(appointment: AppointmentResponse | null): void {
        if(appointment && !appointment.isAcknowledged) {
            this.acknowledgeAppointment(appointment);
        }
        this._selectedAppointment.set(appointment);
        console.log('selected appointment:', appointment?.id);
    }

    acknowledgeAppointment(appointment: AppointmentResponse): void {
        const payload: UpdateAppointmentRequest = { ...appointment, isAcknowledged: true };
        this.updateAppointment(appointment.id, payload).subscribe({
            next: (updatedAppointment) => {
                console.log('acknowledged appointment:', updatedAppointment.id);
            },
            error: (error) => {
                console.error('error while acknowledging the appointment:', error);
            }
        })
    }

    updateAppointment(id: number, appointment: UpdateAppointmentRequest): Observable<AppointmentResponse> {
        return this.api.updateAppointment(id, appointment).pipe(
            tap((updatedAppointment) => {
                this._searchResults.update(list =>
                    list.map(appointment => appointment.id === id ? updatedAppointment : appointment)
                );

                if(this._selectedAppointment()?.id === id) {
                    this._selectedAppointment.set(updatedAppointment);
                }
            })
        );
    }

    createAppointment(appointment: CreateAppointmentRequest): Observable<AppointmentResponse> {
        return this.api.createAppointment(appointment).pipe(
            tap((createdAppointment) => {
                this._searchResults.update(list => [...list, createdAppointment])
            })
        );
    }

    deleteAppointment(id: number) {
        return this.api.deleteAppointment(id).pipe(
            tap(() => {
                this._searchResults.update(list => 
                    list.filter(appointment => appointment.id !== id)
                );

                if (this._selectedAppointment()?.id === id) {
                    this._selectedAppointment.set(null);
                }
            })
        );
    }

    searchAppointments(searchRequest: AppointmentSearchRequest | null): void {
        if(!searchRequest) return;

        this._isLoading.set(true);
        this._errorMessage.set(null);

        this.api.searchAppointments(searchRequest).subscribe({
            next: (searchResults) => {
                this._searchResults.set(searchResults);
                this._isLoading.set(false);
            },
            error: (error) => {
                console.error('Failed to search for appointments:', error);
                this._errorMessage.set('Failed to search for appointments.');
                this._isLoading.set(false);
            }
        });
    }

    triggerSearchRequest(): void {
        this.searchAppointments(this.searchRequest());
    }

    setSearchRequest(searchRequest: AppointmentSearchRequest): void {
        this._searchRequest.set(searchRequest);
    }
    
    // searchAppointments(partialSearchRequest: Partial<AppointmentSearchRequest>): void {
    //     this._isLoading.set(true);
    //     this._errorMessage.set(null);

    //     this._currentSearchRequest.update(current => ({
    //         ...current,
    //         ...partialSearchRequest
    //     }));

    //     const finalRequest = this._currentSearchRequest();
        
    //     this.api.search(finalRequest).subscribe({
    //         next: (searchResults) => {
    //             this._searchResults.set(searchResults);
    //             this._isLoading.set(false);
    //         },
    //         error: (error) => {
    //             this._errorMessage.set('Failed to search for appointments.');
    //             this._isLoading.set(false);
    //         }
    //     })
    // }
}