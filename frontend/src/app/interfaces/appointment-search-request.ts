import { AppointmentStatus } from "./appointment-status";

export interface AppointmentSearchRequest {
    sortField: string | null;
    ascending: boolean | null;
    globalText: string | null;
    startDateFrom: string | null;
    startDateTo: string | null;
    appointmentStatus: AppointmentStatus | null;
}