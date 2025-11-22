import { AppointmentStatus } from "./appointment-status";

export interface ClinicianAppointmentRequest {

    // Appointment details

    startDateTime: string;
    durationInSeconds: number;
    appointmentStatus: AppointmentStatus;

    // Patient details

    patientFullName: string;
    patientEmail: string;
    patientPhoneNumber: string;
    patientReason: string;
    clinicianNotes: string;

    // Audit details
    
    isAcknowledged: boolean;
}