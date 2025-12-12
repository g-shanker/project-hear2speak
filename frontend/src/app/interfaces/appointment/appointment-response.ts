import { AppointmentStatus } from "./appointment-status";

export interface AppointmentResponse {
    
    id: number;

    //  Appointment details

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
    createdAt: string;
    updatedAt: string;
    
}