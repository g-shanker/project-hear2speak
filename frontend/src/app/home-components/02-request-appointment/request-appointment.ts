import { CommonModule } from '@angular/common';
import { Component, inject, signal, viewChild } from '@angular/core';
import { AppointmentService } from '../../services/component/appointment-service';
import { AppointmentForm, FormMode } from '../../domain-components/appointment-form/appointment-form';
import { CreateAppointmentRequest } from '../../interfaces/appointment/create-appointment-request';
import { AppointmentStatus } from '../../interfaces/appointment/appointment-status';

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

    mode = "PATIENT" as FormMode;
    defaultDurationInMinutes = 45;
    defaultAppointmentStatus = 'REQUESTED' as AppointmentStatus;

    async onSubmit(): Promise<void> {

        this.isSubmitting.set(true);
        this.submitError.set(false);
        const formState = this.appointmentForm();

        if(!formState) {
            this.isSubmitting.set(false);
            return;
        }

        const payload: CreateAppointmentRequest | null = formState.getFormContents();

        if(!payload) {
            this.isSubmitting.set(false);
            return;
        }

        this.appointmentService.createAppointment(payload).subscribe({
            next: (createdAppointment) => {
                console.log('Created appointment successfully:', createdAppointment);
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
