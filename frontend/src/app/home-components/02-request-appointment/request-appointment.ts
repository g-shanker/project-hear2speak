import { CommonModule } from '@angular/common';
import { Component, inject, signal, viewChild } from '@angular/core';
import { AppointmentForm } from '../../domain-components/appointment-form/appointment-form';
import { AppointmentService } from '../../services/component/appointment-service';
import { CreateAppointmentRequest } from '../../interfaces/appointment/create-appointment-request';

@Component({
  selector: 'app-request-appointment',
  standalone: true,
  imports: [
    CommonModule,
    AppointmentForm
  ],
  templateUrl: './request-appointment.html',
  styleUrl: './request-appointment.scss',
})

export class RequestAppointment {
    private appointmentService = inject(AppointmentService)
    appointmentForm = viewChild(AppointmentForm);
    isSubmitting = signal(false);
    submitSuccess = signal(false);
    submitError = signal(false);

    async onSubmit(): Promise<void> {
        this.isSubmitting.set(true);
        this.submitError.set(false);
        const formState = this.appointmentForm();

        if(!formState) {
            this.isSubmitting.set(false);
            return;
        }

        const payload: CreateAppointmentRequest | null = formState.getPatientPayload();

        if(!payload) {
            this.isSubmitting.set(false);
            return;
        }

        console.log('Submitting Patient Request:', payload);

        this.appointmentService.createAppointment(payload).subscribe({
            next: (createdAppointment) => {
                console.log('Created patient appointment successfully:', createdAppointment);
                this.isSubmitting.set(false);
                this.submitSuccess.set(true);
            },
            error: (error) => {
                console.error('Error while creating appointment:', error);
                this.isSubmitting.set(false);
                this.submitError.set(true);
            }
        });
    }

    resetView(): void {
        this.submitSuccess.set(false);
        this.submitError.set(false);
    }
}
