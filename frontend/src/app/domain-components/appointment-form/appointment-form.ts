import { Component, effect, inject, input } from '@angular/core';
import { AppointmentResponse } from '../../interfaces/appointment/appointment-response';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentStatus } from '../../interfaces/appointment/appointment-status';
import { CreateAppointmentRequest } from '../../interfaces/appointment/create-appointment-request';
import { UpdateAppointmentRequest } from '../../interfaces/appointment/update-appointment-request';

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

    originalData = input<AppointmentResponse | null>(null);

    defaultStartTime = input<string>('');
    defaultDurationInMinutes = input.required<number>();
    defaultAppointmentStatus = input.required<AppointmentStatus>();

    form = this.formBuilder.group({

        // Common fields

        patientFullName: ['', Validators.required],
        patientEmail: ['', [Validators.required, Validators.email]],
        patientPhoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        patientReason: ['', Validators.required],
        startDateTime: [this.defaultStartTime(), Validators.required],

        // Clinician-specific fields
        
        appointmentStatus: [this.defaultAppointmentStatus(), Validators.required],
        durationInMinutes: [this.defaultDurationInMinutes(), Validators.required],
        clinicianNotes: ['']
    });

    constructor() {
        effect(() => {
            const originalData = this.originalData();
            if (originalData) {
                this.form.patchValue({
                    ...originalData,
                    durationInMinutes: Math.floor(originalData.durationInSeconds / 60)
                });
            }
        });
    }

    getFormContents(): CreateAppointmentRequest | UpdateAppointmentRequest | null {
        if(this.form.invalid) {
            this.form.markAllAsTouched();
            return null;
        }

        const raw = this.form.getRawValue();
        const originalData = this.originalData();

        return {

            // Common fields

            patientFullName: raw.patientFullName!,
            patientEmail: raw.patientEmail!,
            patientPhoneNumber: raw.patientPhoneNumber!,
            patientReason: raw.patientReason!,
            startDateTime: raw.startDateTime!,

            // Clinician-specific fields

            durationInSeconds: Number(raw.durationInMinutes) * 60,
            appointmentStatus: raw.appointmentStatus as AppointmentStatus,
            clinicianNotes: raw.clinicianNotes || null,
            isAcknowledged: originalData?.isAcknowledged || false
        };
    }

    reset() {
        this.form.reset({
            appointmentStatus: this.defaultAppointmentStatus(),
            durationInMinutes: this.defaultDurationInMinutes(),
            startDateTime: this.defaultStartTime(),
            patientFullName: '',
            patientEmail: '',
            patientPhoneNumber: '',
            patientReason: '',
            clinicianNotes: ''
        })
    }

}
