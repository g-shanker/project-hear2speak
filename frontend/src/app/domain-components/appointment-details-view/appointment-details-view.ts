import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { AppointmentResponse } from '../../interfaces/appointment/appointment-response';

@Component({
    selector: 'app-appointment-details-view',
    standalone: true,
    imports: [
        DatePipe,
        CommonModule,
    ],
    templateUrl: './appointment-details-view.html',
    styleUrls: ['./appointment-details-view.scss'],
})

export class AppointmentDetailsView {
    appointment = input<AppointmentResponse | null>(null);

    durationInMinutes = computed(() => {
        const appointment = this.appointment();
        return appointment ? Math.floor(appointment.durationInSeconds / 60) : 0;
    });
}
