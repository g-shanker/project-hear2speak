import { AppointmentStatus } from "./appointment-status";

export interface AppointmentResponse {
    id: number;
    startDateTime: string;
    durationInSeconds: number;
    appointmentStatus: AppointmentStatus;
    location: string;
    previousAppointmentId: number | null;
    patientFullName: string;
    patientEmail: string;
    patientPhoneNumber: string;
    patientReason: string;
    clinicianNotes: string;
    isAcknowledged: boolean;
    createdAt: string;
    updatedAt: string;
}