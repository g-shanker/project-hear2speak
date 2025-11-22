import { Component, inject, input, signal, viewChild } from '@angular/core';
import { AppointmentForm } from '../appointment-form/appointment-form';
import { AppointmentService } from '../../services/appointment-service';
import { AppointmentResponse } from '../../interfaces/appointment-response';
import { AppointmentDetailsView } from '../appointment-details-view/appointment-details-view';

@Component({
    selector: 'app-appointment-view-panel',
    standalone: true,
    imports: [
        AppointmentForm,
        AppointmentDetailsView
    ],
    templateUrl: './appointment-view-panel.html',
    styleUrls: ['./appointment-view-panel.scss'],
})

export class AppointmentViewPanel {
    private appointmentService = inject(AppointmentService)
    appointment = input<AppointmentResponse | null>(null);
    editMode = signal(false);
    isSaving = signal(false);
    appointmentForm = viewChild(AppointmentForm);

    saveChanges(): void {
        const formInstance = this.appointmentForm();
        const currentAppointment = this.appointment();

        if (!formInstance || !currentAppointment) return;

        const payload = formInstance.getClinicianPayload();

        if (payload) {
            this.isSaving.set(true);
            this.appointmentService.updateAppointment(currentAppointment.id, payload).subscribe({
                next: (updatedAppointment) => {
                    console.log('Updated clinician appointment successfully:', updatedAppointment);
                    this.isSaving.set(false);
                    this.editMode.set(false);
                },
                error: (err) => {
                    console.error('Error while updating clinician appointment:', err);
                    this.isSaving.set(false);
                }
            });
        }
    }
}