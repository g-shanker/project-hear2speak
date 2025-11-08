export interface PatientAppointmentRequest {
  startDateTime: string;
  patientFullName: string;
  patientEmail: string;
  patientPhoneNumber: string;
  patientReason: string;
}