import { Component, effect, inject, input } from '@angular/core';
import { AppointmentResponse } from '../../interfaces/appointment-response';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientAppointmentRequest } from '../../interfaces/patient-appointment-request';
import { ClinicianAppointmentRequest } from '../../interfaces/clinician-appointment-request';
import { AppointmentStatus } from '../../interfaces/appointment-status';

export type FormMode = 'CLINICIAN' | 'PATIENT';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './appointment-form.html',
    styleUrls: ['./appointment-form.scss'],
})

export class AppointmentForm {
    private formBuilder = inject(FormBuilder);

        mode = input<FormMode>('CLINICIAN');
        initialData = input<AppointmentResponse | null>(null);

    form = this.formBuilder.group({

        // Common fields

        patientFullName: ['', Validators.required],
        patientEmail: ['', [Validators.required, Validators.email]],
        patientPhoneNumber: ['', Validators.required],
        patientReason: ['', Validators.required],
        startDateTime: ['', Validators.required],

        // Clinician-specific fields
        
        appointmentStatus: ['REQUESTED', Validators.required],
        durationInMinutes: [30, Validators.required],
        clinicianNotes: ['']
    });

    constructor() {
        effect(() => {
            const controls = this.form.controls;
            if (this.mode() === 'PATIENT') {
                controls.appointmentStatus.disable();
                controls.durationInMinutes.disable();
                controls.clinicianNotes.disable();
            } else {
                controls.appointmentStatus.enable();
                controls.durationInMinutes.enable();
                controls.clinicianNotes.enable();
            }
        });

        effect(() => {
            const data = this.initialData();
            if (data) {
                this.form.patchValue({
                    ...data,
                    durationInMinutes: Math.floor(data.durationInSeconds / 60)
                });
            }
        });
    }

    getPatientPayload(): PatientAppointmentRequest | null {
        if(this.form.invalid) {
            this.form.markAllAsTouched();
            return null;
        }

        const raw = this.form.getRawValue();
        return {

            // Common fields

            patientFullName: raw.patientFullName!,
            patientEmail: raw.patientEmail!,
            patientPhoneNumber: raw.patientPhoneNumber!,
            patientReason: raw.patientReason!,
            startDateTime: raw.startDateTime!
        };
    }

    getClinicianPayload(): ClinicianAppointmentRequest | null {
        if(this.form.invalid) {
            this.form.markAllAsTouched();
            return null;
        }

        const raw = this.form.getRawValue();
        const original = this.initialData();

        return {

            // Common fields

            patientFullName: raw.patientFullName!,
            patientEmail: raw.patientEmail!,
            patientPhoneNumber: raw.patientPhoneNumber!,
            patientReason: raw.patientReason!,
            startDateTime: raw.startDateTime!,

            // Clinician-specific fields

            durationInSeconds: (Number(raw.durationInMinutes) || 30) * 60,
            appointmentStatus: raw.appointmentStatus as AppointmentStatus,
            clinicianNotes: raw.clinicianNotes || '',
            isAcknowledged: original?.isAcknowledged || false
        };
    }

    reset() {
        this.form.reset({
            appointmentStatus: 'REQUESTED',
            durationInMinutes: 30,
            startDateTime: '',
            patientFullName: '',
            patientEmail: '',
            patientPhoneNumber: '',
            patientReason: '',
            clinicianNotes: ''
        })
    }

}
