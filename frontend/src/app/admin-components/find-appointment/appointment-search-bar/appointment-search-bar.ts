import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../../services/appointment-service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppointmentResponse } from '../../../interfaces/appointment-response';
import { AppointmentSearchRequest } from '../../../interfaces/appointment-search-request';

@Component({
    selector: 'app-appointment-search-bar',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: './appointment-search-bar.html',
    styleUrl: './appointment-search-bar.scss',
})

export class AppointmentSearchBar {
    searchResults: AppointmentResponse[] = [];
    searchForm: FormGroup;
    advancedSearch: boolean = false;
 
    constructor(
        private formBuilder: FormBuilder,
        private appointmentService: AppointmentService
    ) {
        this.searchForm = this.formBuilder.group({
            globalText: [],
            appointmentStatus: ['ALL_STATUSES'],
            startDateFrom: [],
            startDateTo: [],
            sortField: ['createdAt'],
            ascending: [false]
        })
    }

    toggleAdvancedSearch(): void {
        this.advancedSearch = !this.advancedSearch;
    }

    getValueOrNull(field: string) {
        const val = this.searchForm.get(field)?.value;
        if (val === '' || val === undefined || val === 'ALL_STATUSES') return null;
        return val;
    }

    submitSearch(): void {
        if(this.searchForm.valid) {
            const payload: AppointmentSearchRequest = {
                globalText: this.getValueOrNull('globalText'),
                appointmentStatus: this.getValueOrNull('appointmentStatus'),
                startDateFrom: this.getValueOrNull('startDateFrom'),
                startDateTo: this.getValueOrNull('startDateTo'),
                sortField: this.getValueOrNull('sortField') || 'createdAt',
                ascending: this.searchForm.get('ascending')?.value ?? false
            };

            this.appointmentService.searchAppointments(payload).subscribe({
                next: (appointments: AppointmentResponse[]) => {
                    this.searchResults = appointments;
                    this.appointmentService.notifySearchResultsUpdated(this.searchResults);
                },
                error: (error : any) => {
                    const errorMessage = 'Failed to search for appointments: ' + error;
                    console.log(errorMessage);
                }
            })
        }
    }
}
