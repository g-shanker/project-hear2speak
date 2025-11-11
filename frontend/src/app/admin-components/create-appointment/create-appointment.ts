import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../services/appointment-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientAppointmentRequest } from '../../interfaces/patient-appointment-request';

@Component({
    selector: 'app-create-appointment',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: './create-appointment.html',
    styleUrl: './create-appointment.scss',
})

export class CreateAppointment {
    appointmentForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private appointmentService: AppointmentService
    ) {
        this.appointmentForm = this.fb.group({
            date: ['', Validators.required],
            time: ['', Validators.required],
            patientFullName: ['', Validators.required],
            patientEmail: ['', Validators.required],
            patientPhoneNumber: ['', Validators.required],
            reason: ['', Validators.required],
        });
    }

    onSubmit(): void {
        if (this.appointmentForm.valid) {

            const startDate = this.appointmentForm.get('date')?.value;
            const startTime = this.appointmentForm.get('time')?.value;
            const startDateTime = `${startDate}T${startTime}:00`;
            
            const payload: PatientAppointmentRequest = {
                startDateTime: startDateTime,
                patientFullName: this.appointmentForm.get('patientFullName')?.value,
                patientEmail: this.appointmentForm.get('patientEmail')?.value,
                patientPhoneNumber: this.appointmentForm.get('patientPhoneNumber')?.value,
                patientReason: this.appointmentForm.get('reason')?.value,
            }
          
            this.appointmentService.createAppointment(payload)
            .subscribe({
                next: (response) => {
                    console.log('Appointment created successfully:', response);
                    this.appointmentForm.reset();
                },
                error: (error) => {
                    console.error('Error creating appointment:', payload, error);
                }
            });
        }
    }
}
