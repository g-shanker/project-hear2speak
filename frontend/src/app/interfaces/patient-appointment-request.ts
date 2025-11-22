export interface PatientAppointmentRequest {

    // Appointment details

    startDateTime: string;

    // Patient details

    patientFullName: string;
    patientEmail: string;
    patientPhoneNumber: string;
    patientReason: string;
}