import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment-service';
import { AppointmentResponse } from '../../interfaces/appointment-response';
import { AppointmentSearchBar } from './appointment-search-bar/appointment-search-bar';
import { AppointmentViewPanel } from './appointment-view-panel/appointment-view-panel';
import { AppointmentSummaryPanel } from './appointment-summary-panel/appointment-summary-panel';

@Component({
    selector: 'app-find-appointment',
    standalone: true,
    imports: [
        CommonModule,
        AppointmentSearchBar,
        AppointmentViewPanel,
        AppointmentSummaryPanel
    ],
    templateUrl: './find-appointment.html',
    styleUrl: './find-appointment.scss',
})

export class FindAppointment implements OnInit {
    isLoading: boolean = true;
    errorMessage: string = '';
    appointments: AppointmentResponse[] = [];
    selectedAppointment: AppointmentResponse | null = null;

    constructor(
        private appointmentService: AppointmentService
    ) {
        this.appointmentService.appointmentSelected$.subscribe(selected => {
            if(!selected) return;
            this.selectedAppointment = selected;
        })
        this.appointmentService.appointmentUpdated$.subscribe(updated => {
            if(!updated) return;
            if(this.selectedAppointment?.id === updated.id) this.selectedAppointment = updated;
            this.appointments = this.appointments.map(a =>
                a.id === updated.id ? updated : a
            );
        })
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.getAppointments();
        }, 1000);
    }

    getAppointments(): void {
        this.isLoading = true;
        this.appointmentService.getAllAppointments().subscribe({
            next: (appointments: AppointmentResponse[]) => {
                this.appointments = appointments;
                this.isLoading = false;
            },
            error: (error: any) => {
                this.errorMessage = 'Failed to load appointments: ' + error;
                this.isLoading = false;
            }
        })
    }
}
