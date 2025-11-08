import { AppointmentStatus } from "./appointment-status";

export interface ClinicianAppointmentRequest {
  startDateTime: string;
  patientFullName: string;
  patientEmail: string;
  patientPhoneNumber: string;
  patientReason: string;
  durationInSeconds: number;
  appointmentStatus: AppointmentStatus;
  location: string;
  previousAppointmentId: number | null;
  clinicianNotes: string;
}