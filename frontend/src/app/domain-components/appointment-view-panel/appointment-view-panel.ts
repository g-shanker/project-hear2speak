import { Component, inject, input, output, signal, viewChild } from '@angular/core';
import { AppointmentForm } from '../appointment-form/appointment-form';
import { AppointmentResponse } from '../../interfaces/appointment/appointment-response';
import { AppointmentDetailsView } from '../appointment-details-view/appointment-details-view';
import { AppointmentService } from '../../services/component/appointment-service';
import { AppointmentStatus } from '../../interfaces/appointment/appointment-status';
import { ToastService } from '../../services/component/toast-service';

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
    private toastService = inject(ToastService);

    appointment = input<AppointmentResponse | null>(null);
    close = output<void>();
    editMode = signal(false);
    isSaving = signal(false);
    isDeleteModalOpen = signal(false);
    appointmentForm = viewChild(AppointmentForm);

    defaultAppointmentStatus = 'SCHEDULED' as AppointmentStatus;
    defaultDurationInMinutes = 45;

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
                    this.toastService.show('Updated appointment successfully!', 'success');
                    this.isSaving.set(false);
                    this.editMode.set(false);
                },
                error: (error) => {
                    console.error('Error while updating appointment:', error);
                    this.toastService.show('Error whie updating appointment.', 'error');
                    this.isSaving.set(false);
                }
            });
        }
    }

    initiateDelete(): void {
        this.isDeleteModalOpen.set(true);
    }

    cancelDelete(): void {
        this.isDeleteModalOpen.set(false);
    }

    confirmDelete(): void {
        const id = this.appointment()?.id;
        if(id) {
            this.appointmentService.deleteAppointment(id).subscribe({
                next: () => {
                    this.toastService.show('Appointment deleted successfully!', 'success');
                    this.isDeleteModalOpen.set(false);
                    this.close.emit();
                },
                error: (error) => {
                    console.error('Error while deleting appointment:', error);
                    this.toastService.show('Error while deleting appointment.', 'error');
                    this.isDeleteModalOpen.set(false); 
                }
            });
        }
    }
}