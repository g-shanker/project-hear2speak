import { Component, inject, input, output, signal, viewChild } from '@angular/core';
import { AppointmentForm } from '../appointment-form/appointment-form';
import { AppointmentResponse } from '../../interfaces/appointment/appointment-response';
import { AppointmentDetailsView } from '../appointment-details-view/appointment-details-view';
import { AppointmentService } from '../../services/component/appointment-service';
import { AppointmentStatus } from '../../interfaces/appointment/appointment-status';
import { ToastService } from '../../services/component/toast-service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-appointment-view-panel',
    standalone: true,
    imports: [
        AppointmentForm,
        AppointmentDetailsView,
    ],
    templateUrl: './appointment-view-panel.html',
    styleUrls: ['./appointment-view-panel.scss'],
    providers: [DatePipe]
})

export class AppointmentViewPanel {
    private appointmentService = inject(AppointmentService);
    private toastService = inject(ToastService);
    private datePipe = inject(DatePipe);

    private readonly CLINIC_MAPS_LINK = 'https://maps.app.goo.gl/YourShortLinkHere';

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
        if (id) {
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

    contactViaWhatsApp(): void {
        const appointment = this.appointment();
        if (!appointment || !appointment.patientPhoneNumber) {
            this.toastService.show('No phone number available for this patient.', 'error');
            return;
        }

        // Assuming India (91) if missing. Adjust logic for your region.
        let phone = appointment.patientPhoneNumber.replace(/\D/g, ''); 
        if (phone.length === 10) phone = '91' + phone;

        // 2. Generate Smart Message based on Status
        const message = this.getSmartMessage(appointment);

        // 3. Open WhatsApp
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    private getSmartMessage(appointment: AppointmentResponse): string {
        const dateStr = this.datePipe.transform(appointment.startDateTime, 'fullDate'); // "Tuesday, December 16, 2025"
        const timeStr = this.datePipe.transform(appointment.startDateTime, 'shortTime'); // "4:30 PM"
        
        // We use \n for line breaks which encodeURIComponent will handle correctly
        const detailsBlock = `*Patient Details:*\nName: ${appointment.patientFullName}\nPhone: ${appointment.patientPhoneNumber}\nReason: ${appointment.patientReason || 'General Consultation'}`;

        switch (appointment.appointmentStatus) {
            case 'REQUESTED':
                return `Hello ${appointment.patientFullName}, we have received your appointment request via our website. We will review our schedule and get back to you shortly.\n\n${detailsBlock}\n\nSince this is a direct line to the clinician, please *reply to this message* if you need to correct any details.`;
            
            case 'SCHEDULED':
                return `Hi ${appointment.patientFullName}, your appointment at Hear2Speak has been *CONFIRMED* for ${dateStr} at ${timeStr}.\n\n${detailsBlock}\n\nLocation: ${this.CLINIC_MAPS_LINK}\n\nPlease ensure to be there on time. You can *reply directly to this number* if you have any questions or need to reschedule.`;

            default:
                return '';
        }
    }
}