import { AppointmentStatus } from "./appointment-status";

export interface AppointmentSearchRequest {

    // sort parameters

    sortField: string | null;
    ascending: boolean | null;

    // search parameters

    globalText: string | null;
    startDateFrom: string | null;
    startDateTo: string | null;
    appointmentStatus: AppointmentStatus | null;

    // pagination

    page: number | null;
    size: number | null;

}