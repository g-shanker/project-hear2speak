import { AppointmentStatus } from "./appointment-status";

export interface CreateAppointmentRequest {

    // Appointment details

    startDateTime: string;
    durationInSeconds: number | null;
    appointmentStatus: AppointmentStatus | null;

    // Patient details

    patientFullName: string;
    patientEmail: string;
    patientPhoneNumber: string;
    patientReason: string;
    clinicianNotes: string | null;

    // Audit details

    isAcknowledged: boolean | null;

}