import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AppointmentResponse } from '../../../../interfaces/appointment-response';

@Component({
    selector: 'app-appointment-details-view',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './appointment-details-view.html',
    styleUrl: './appointment-details-view.scss',
})

export class AppointmentDetailsView {
    @Input() appointment: AppointmentResponse | null = null;
}
