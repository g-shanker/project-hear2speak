import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../services/appointment-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientAppointmentRequest } from '../../interfaces/patient-appointment-request';
import { ClinicianAppointmentRequest } from '../../interfaces/clinician-appointment-request';

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
        private formBuilder: FormBuilder,
        private appointmentService: AppointmentService
    ) {
        this.appointmentForm = this.formBuilder.group({
            patientFullName: ['', Validators.required],
            appointmentStatus: ['', Validators.required],
            patientEmail: ['', Validators.required],
            patientPhoneNumber: ['', Validators.required],
            startDateTime: ['', Validators.required],
            durationInMinutes: ['', Validators.required],
            location: ['', Validators.required],
            patientReason: ['', Validators.required],
            clinicianNotes: ['']
        });
    }

    onSubmit() {
        if(this.appointmentForm.valid) {
            const payload: ClinicianAppointmentRequest = {
                startDateTime: this.appointmentForm.get('startDateTime')?.value,
                patientFullName: this.appointmentForm.get('patientFullName')?.value,
                patientEmail: this.appointmentForm.get('patientEmail')?.value,
                patientPhoneNumber: this.appointmentForm.get('patientPhoneNumber')?.value,
                patientReason: this.appointmentForm.get('patientReason')?.value,
                durationInSeconds: this.appointmentForm.get('durationInMinutes')?.value * 60,
                appointmentStatus: this.appointmentForm.get('appointmentStatus')?.value,
                location: this.appointmentForm.get('location')?.value,
                clinicianNotes: this.appointmentForm.get('clinicianNotes')?.value,
                previousAppointmentId: null,
                isAcknowledged: false,
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
