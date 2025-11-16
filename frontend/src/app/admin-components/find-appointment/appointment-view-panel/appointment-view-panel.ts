import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { AppointmentResponse } from '../../../interfaces/appointment-response';
import { AppointmentEditView } from './appointment-edit-view/appointment-edit-view';
import { AppointmentDetailsView } from './appointment-details-view/appointment-details-view';
import { AppointmentService } from '../../../services/appointment-service';

@Component({
    selector: 'app-appointment-view-panel',
    standalone: true,
    imports: [
        CommonModule,
        AppointmentEditView,
        AppointmentDetailsView
    ],
    templateUrl: './appointment-view-panel.html',
    styleUrl: './appointment-view-panel.scss',
})

export class AppointmentViewPanel {
    @Input() appointment: AppointmentResponse | null = null;
    @ViewChild('editView') editView !: AppointmentEditView;
    editMode: boolean = false;

    constructor (
        private appointmentService: AppointmentService
    ) {
        this.appointmentService.appointmentUpdated$.subscribe(updated => {
            if(!updated) return;
            if(this.appointment?.id === updated.id) this.appointment = updated;
        })
    }

    toggleEditMode(): void {
        this.editMode = !this.editMode;
    }

    updateAppointment(): void {
        const updateSuccessful = this.editView.onSubmit();
        if(updateSuccessful) {
            this.editMode = false;
        }
    }
}