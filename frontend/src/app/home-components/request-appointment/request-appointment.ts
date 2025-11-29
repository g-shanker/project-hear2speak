import { CommonModule } from '@angular/common';
import { Component, inject, signal, viewChild } from '@angular/core';
import { AppointmentForm } from '../../domain-components/appointment-form/appointment-form';
import { PatientAppointmentRequest } from '../../interfaces/patient-appointment-request';
import { AppointmentService } from '../../services/appointment-service';

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

    async onSubmit() {
        this.isSubmitting.set(true);
        this.submitError.set(false);
        const formState = this.appointmentForm();

        if(!formState) {
            this.isSubmitting.set(false);
            return;
        }

        const payload: PatientAppointmentRequest | null = formState.getPatientPayload();

        if(!payload) {
            this.isSubmitting.set(false);
            return;
        }

        console.log('Submitting Patient Request:', payload);

        this.appointmentService.createPatientAppointment(payload).subscribe({
                next: (createdAppointment) => {
                    console.log('Created patient appointment successfully:', createdAppointment);
                    this.isSubmitting.set(false);
                    this.submitSuccess.set(true);
                },
                error: (err) => {
                    console.error('Error while creating patient appointment:', err);
                    this.isSubmitting.set(false);
                    this.submitError.set(true);
                }
            });
    }

    resetView() {
        this.submitSuccess.set(false);
        this.submitError.set(false);
    }
}
