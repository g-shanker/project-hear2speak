import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppointmentResponse } from '../../interfaces/appointment-response';

@Component({
  selector: 'app-appointment-summary-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-summary-panel.html',
  styleUrl: './appointment-summary-panel.scss',
})
export class AppointmentSummaryPanel {
  @Input() appointments: AppointmentResponse[] = [];
  @Output() appointmentSelected = new EventEmitter<AppointmentResponse>();

  selectedAppointment: AppointmentResponse | null = null;

  selectAppointment(appointment: AppointmentResponse): void {
    this.selectedAppointment = appointment;
    this.appointmentSelected.emit(appointment);
  }
}
