import { AppointmentStatus } from "./appointment-status";

export interface AppointmentSearchRequest {
    sortField?: string;
    ascending?: boolean;
    globalText?: string;
    startDateFrom?: string;
    startDateTo?: string;
    appointmentStatus?: AppointmentStatus;
}