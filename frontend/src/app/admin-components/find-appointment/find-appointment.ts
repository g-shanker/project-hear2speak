import { Component, inject, OnInit } from '@angular/core';
import { AppointmentResponse } from '../../interfaces/appointment/appointment-response';
import { AppointmentSearchRequest } from '../../interfaces/appointment/appointment-search-request';
import { AppointmentSearchBar } from '../../domain-components/appointment-search-bar/appointment-search-bar';
import { AppointmentSummaryPanel } from '../../domain-components/appointment-summary-panel/appointment-summary-panel';
import { AppointmentViewPanel } from '../../domain-components/appointment-view-panel/appointment-view-panel';
import { AppointmentService } from '../../services/component/appointment-service';

@Component({
    selector: 'app-find-appointment',
    standalone: true,
    imports: [
        AppointmentSearchBar,
        AppointmentViewPanel,
        AppointmentSummaryPanel,
    ],
    templateUrl: './find-appointment.html',
    styleUrls: ['./find-appointment.scss'],
})

export class FindAppointment implements OnInit {
    private appointmentService = inject(AppointmentService);

    isLoading = this.appointmentService.isLoading;
    errorMessage = this.appointmentService.errorMessage;
    appointments = this.appointmentService.searchResults;
    selectedAppointment = this.appointmentService.selectedAppointment;

    onSelect(appointment: AppointmentResponse): void {
        this.appointmentService.selectAppointment(appointment);
    }

    onSearch(searchRequest: AppointmentSearchRequest) {
        this.appointmentService.setSearchRequest(searchRequest);
        this.appointmentService.triggerSearchRequest();
    }

    closePanel() {
        this.appointmentService.selectAppointment(null);
    }

    ngOnInit(): void {
        this.appointmentService.setSearchRequest({
            sortField: 'createdAt',
            ascending: false,
            globalText: null,
            startDateFrom: null,
            startDateTo: null,
            appointmentStatus: null,

            page: null,
            size: null
        });
        this.appointmentService.triggerSearchRequest();
    }
}
