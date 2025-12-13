import { Component, inject, input, output, signal, viewChild } from '@angular/core';
import { AppointmentForm } from '../appointment-form/appointment-form';
import { AppointmentResponse } from '../../interfaces/appointment/appointment-response';
import { AppointmentDetailsView } from '../appointment-details-view/appointment-details-view';
import { AppointmentService } from '../../services/component/appointment-service';

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
    private appointmentService = inject(AppointmentService);

    appointment = input<AppointmentResponse | null>(null);
    close = output<void>();
    editMode = signal(false);
    isSaving = signal(false);
    appointmentForm = viewChild(AppointmentForm);

    saveChanges(): void {
        const formInstance = this.appointmentForm();
        const currentAppointment = this.appointment();

        if (!formInstance || !currentAppointment) return;

        const payload = formInstance.getFormContents();

        if (payload) {
            this.isSaving.set(true);
            this.appointmentService.updateAppointment(currentAppointment.id, payload).subscribe({
                next: (updatedAppointment: AppointmentResponse) => {
                    console.log('Updated appointment successfully:', updatedAppointment);
                    this.isSaving.set(false);
                    this.editMode.set(false);
                },
                error: (error) => {
                    console.error('Error while updating appointment:', error);
                    this.isSaving.set(false);
                }
            });
        }
    }
}