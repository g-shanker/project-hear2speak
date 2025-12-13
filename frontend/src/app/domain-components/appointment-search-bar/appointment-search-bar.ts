import { Component, inject, output } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { SearchBar } from "../../generic-components/search-bar/search-bar";
import { AppointmentStatus } from "../../interfaces/appointment/appointment-status";
import { AppointmentSearchRequest } from "../../interfaces/appointment/appointment-search-request";

@Component({
    selector: 'app-appointment-search-bar',
    standalone: true,
    imports: [
        SearchBar,
        ReactiveFormsModule,
    ],
    templateUrl: './appointment-search-bar.html',
    styleUrls: ['./appointment-search-bar.scss'],
})

export class AppointmentSearchBar {
    private formBuilder = inject(FormBuilder);
    search = output<AppointmentSearchRequest>();

    searchForm = this.formBuilder.group({
        globalText: [''],
        appointmentStatus: ['ALL_STATUSES'],
        startDateFrom: [''],
        startDateTo: [''],
        sortField: ['createdAt'],
        ascending: [false]
    });

    handleSearch(): void {
        const raw = this.searchForm.getRawValue();
        const payload: AppointmentSearchRequest = {
            globalText: raw.globalText || null,
            appointmentStatus: raw.appointmentStatus === 'ALL_STATUSES' ? null : raw.appointmentStatus as AppointmentStatus,
            startDateFrom: raw.startDateFrom || null,
            startDateTo: raw.startDateTo || null,
            sortField: raw.sortField || 'createdAt',
            ascending: raw.ascending ?? false,

            page: null,
            size: null
        };
        this.search.emit(payload);
    }
}
