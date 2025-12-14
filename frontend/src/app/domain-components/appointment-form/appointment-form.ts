import { Component, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentStatus } from '../../interfaces/appointment/appointment-status';
import { AppointmentResponse } from '../../interfaces/appointment/appointment-response';
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
    private formBuilder = inject(FormBuilder).nonNullable;

    originalData = input<AppointmentResponse | null>(null);
    
    mode = input<FormMode>('CLINICIAN');
    defaultStartTime = input<string>('');
    defaultDurationInMinutes = input<number>(45);
    defaultAppointmentStatus = input<AppointmentStatus>('SCHEDULED' as AppointmentStatus);

    form = this.formBuilder.group({
        patientFullName: ['', Validators.required],
        patientEmail: ['', [Validators.required, Validators.email]],
        patientPhoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        patientReason: ['', Validators.required],
        startDateTime: ['', Validators.required],
        appointmentStatus: ['' as unknown as AppointmentStatus, Validators.required],
        durationInMinutes: [0, [Validators.required, Validators.min(1)]],
        clinicianNotes: ['']
    });

    constructor() {
        effect(() => {
            const mode = this.mode();
            const clinicianControls = [
                this.form.controls.appointmentStatus,
                this.form.controls.durationInMinutes,
                this.form.controls.clinicianNotes
            ];

            if (mode === 'PATIENT') {
                clinicianControls.forEach(c => c.disable());
            } else {
                clinicianControls.forEach(c => c.enable());
            }
        });

        effect(() => {
            this.originalData();
            this.defaultStartTime();
            this.defaultDurationInMinutes();
            this.defaultAppointmentStatus();
            this.reset();
        });
    }

    getFormContents(): CreateAppointmentRequest | UpdateAppointmentRequest | null {
        if (this.form.invalid) {
            console.log('Form is invalid.');
            this.form.markAllAsTouched();
            return null;
        }

        const raw = this.form.getRawValue();
        const originalData = this.originalData();

        return {
            patientFullName: raw.patientFullName,
            patientEmail: raw.patientEmail,
            patientPhoneNumber: raw.patientPhoneNumber,
            patientReason: raw.patientReason,
            startDateTime: raw.startDateTime,

            durationInSeconds: raw.durationInMinutes * 60,
            appointmentStatus: raw.appointmentStatus as AppointmentStatus,
            clinicianNotes: raw.clinicianNotes || null,
            isAcknowledged: originalData?.isAcknowledged || false
        };
    }

    reset() {
        const originalData = this.originalData();
        if (originalData) {
            this.form.reset({
                patientFullName: originalData.patientFullName,
                patientEmail: originalData.patientEmail,
                patientPhoneNumber: originalData.patientPhoneNumber,
                patientReason: originalData.patientReason,
                startDateTime: originalData.startDateTime,
                appointmentStatus: originalData.appointmentStatus,
                clinicianNotes: originalData.clinicianNotes || '',
                durationInMinutes: Math.floor(originalData.durationInSeconds / 60)
            });
        } else {
            this.form.reset({
                // Set defaults from signals
                startDateTime: this.defaultStartTime(),
                durationInMinutes: this.defaultDurationInMinutes(),
                appointmentStatus: this.defaultAppointmentStatus(),

                // Explicitly clear text fields
                patientFullName: '',
                patientEmail: '',
                patientPhoneNumber: '',
                patientReason: '',
                clinicianNotes: ''
            });
        }
    }

}
