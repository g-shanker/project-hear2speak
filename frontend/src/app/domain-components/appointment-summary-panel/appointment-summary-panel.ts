import { CommonModule, DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { SummaryList } from '../../generic-components/summary-list/summary-list';
import { AppointmentResponse } from '../../interfaces/appointment-response';

@Component({
    selector: 'app-appointment-summary-panel',
    standalone: true,
    imports: [
        DatePipe,
        SummaryList,
        CommonModule,
    ],
    templateUrl: './appointment-summary-panel.html',
    styleUrls: ['./appointment-summary-panel.scss'],
})

export class AppointmentSummaryPanel {
    appointments = input.required<AppointmentResponse[]>();
    selectedAppointment = input<AppointmentResponse | null>(null);
    select = output<AppointmentResponse>();
}
