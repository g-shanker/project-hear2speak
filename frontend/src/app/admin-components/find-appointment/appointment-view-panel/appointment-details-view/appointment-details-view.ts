import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AppointmentResponse } from '../../../../interfaces/appointment-response';
import { AppointmentService } from '../../../../services/appointment-service';

@Component({
    selector: 'app-appointment-details-view',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './appointment-details-view.html',
    styleUrl: './appointment-details-view.scss',
})

export class AppointmentDetailsView {
    @Input() appointment: AppointmentResponse | null = null;

    constructor(
        private appointmentService: AppointmentService
    ) {
        this.appointmentService.appointmentUpdated$.subscribe(updated => {
            if(!updated) return;
            if(this.appointment?.id === updated.id) this.appointment = updated;
        })
    }
}
