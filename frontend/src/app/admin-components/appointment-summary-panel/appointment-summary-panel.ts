import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppointmentService } from '../../services/appointment-service';
import { AppointmentResponse } from '../../interfaces/appointment-response';
import { ClinicianAppointmentRequest } from '../../interfaces/clinician-appointment-request';

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

    constructor(private appointmentService: AppointmentService) {}

    updateAppointment(appointment: AppointmentResponse): void {
        if (appointment != null) {
            const payload: ClinicianAppointmentRequest = {
                startDateTime: appointment.startDateTime,
                patientFullName: appointment.patientFullName,
                patientEmail: appointment.patientEmail,
                patientPhoneNumber: appointment.patientPhoneNumber,
                patientReason: appointment.patientReason,
                durationInSeconds: appointment.durationInSeconds,
                appointmentStatus: appointment.appointmentStatus,
                location: appointment.location,
                previousAppointmentId: appointment.previousAppointmentId,
                clinicianNotes: appointment.clinicianNotes,
                isAcknowledged: appointment.isAcknowledged,
            }

            this.appointmentService.updateAppointment(appointment.id, payload)
            .subscribe({
                next: (response) => {
                    console.log('Appointment updated successfully:', response);
                },
                error: (error) => {
                    console.error('Error updating appointment:', payload, error);
                }
            });
        }
    }

    selectAppointment(appointment: AppointmentResponse): void {
        appointment.isAcknowledged = true;
        this.selectedAppointment = appointment;
        this.appointmentSelected.emit(appointment);
        this.updateAppointment(appointment);
    }
}
