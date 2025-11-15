import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../../../services/appointment-service';
import { AppointmentResponse } from '../../../../interfaces/appointment-response';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ClinicianAppointmentRequest } from '../../../../interfaces/clinician-appointment-request';

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
        private appointmentService: AppointmentService,
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

        this.appointmentService.appointmentUpdated$.subscribe(updated => {
            if(!updated) return;
            if(this.appointment?.id === updated.id) this.appointment = updated;
        })
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
        if(this.appointmentForm.valid && this.appointment) {
            const payload: ClinicianAppointmentRequest = {
                startDateTime: this.appointmentForm.get('startDateTime')?.value,
                patientFullName: this.appointmentForm.get('patientFullName')?.value,
                patientEmail: this.appointmentForm.get('patientEmail')?.value,
                patientPhoneNumber: this.appointmentForm.get('patientPhoneNumber')?.value,
                patientReason: this.appointmentForm.get('patientReason')?.value,
                durationInSeconds: this.appointmentForm.get('durationInMinutes')?.value * 60,
                appointmentStatus: this.appointmentForm.get('appointmentStatus')?.value,
                location: this.appointmentForm.get('location')?.value,
                previousAppointmentId: this.appointment.previousAppointmentId,
                clinicianNotes: this.appointmentForm.get('clinicianNotes')?.value,
                isAcknowledged: this.appointment.isAcknowledged,
            }
        
            this.appointmentService.updateAppointment(this.appointment.id, payload)
            .subscribe({
                next: (response) => {
                    console.log('Appointment updated successfully:', response);
                    this.appointmentService.notifyUpdated(response);
                },
                error: (error) => {
                    console.error('Error updating appointment:', payload, error);
                }
            });
        }
    }
}
