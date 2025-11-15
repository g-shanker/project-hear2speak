import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentResponse } from '../../../../interfaces/appointment-response';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentService } from '../../../../services/appointment-service';

@Component({
    selector: 'app-appointment-edit-view',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: './appointment-edit-view.html',
    styleUrl: './appointment-edit-view.scss',
})

export class AppointmentEditView implements OnChanges {
    @Input() appointment: AppointmentResponse | null = null;
    appointmentForm: FormGroup;

    constructor (
        private formbuilder: FormBuilder,
        private appointmentService: AppointmentService
    ) {
        this.appointmentForm = this.formbuilder.group({
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

    ngOnChanges(changes: SimpleChanges): void {
        if(changes['appointment'] && this.appointment != null) {
            this.appointmentForm.patchValue({
                patientFullName: this.appointment.patientFullName,
                appointmentStatus: this.appointment.appointmentStatus,
                patientEmail: this.appointment.patientEmail,
                patientPhoneNumber: this.appointment.patientPhoneNumber,
                startDateTime: this.appointment.startDateTime,
                durationInMinutes: this.appointment.durationInSeconds / 60,
                location: this.appointment.location,
                patientReason: this.appointment.patientReason,
                clinicianNotes: this.appointment.clinicianNotes
            });
        }
    }

    onSubmit(): void {
        console.log('Submitted form.')
    }
}
