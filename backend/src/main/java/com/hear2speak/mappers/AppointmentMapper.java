package com.hear2speak.mappers;

import com.hear2speak.dtos.ClinicianAppointmentRequest;
import com.hear2speak.dtos.PatientAppointmentRequest;
import com.hear2speak.dtos.AppointmentResponse;
import com.hear2speak.entities.AppointmentEntity;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class AppointmentMapper {

    public AppointmentEntity toEntity(ClinicianAppointmentRequest r) {

        AppointmentEntity e = new AppointmentEntity();

        e.startDateTime = r.startDateTime;
        e.patientFullName = r.patientFullName;
        e.patientEmail = r.patientEmail;
        e.patientPhoneNumber = r.patientPhoneNumber;
        e.patientReason = r.patientReason;

        e.durationInSeconds = r.durationInSeconds != null ? r.durationInSeconds : e.durationInSeconds;
        e.appointmentStatus = r.appointmentStatus != null ? r.appointmentStatus : e.appointmentStatus;
        e.location = r.location != null ? r.location : e.location;
        e.previousAppointmentId = r.previousAppointmentId != null ? r.previousAppointmentId : e.previousAppointmentId;
        e.clinicianNotes = r.clinicianNotes != null ? r.clinicianNotes : e.clinicianNotes;
        e.isAcknowledged = r.isAcknowledged != null ? r.isAcknowledged : e.isAcknowledged;

        return e;
    }

    public AppointmentEntity toEntity(PatientAppointmentRequest r) {

        AppointmentEntity e = new AppointmentEntity();

        e.startDateTime = r.startDateTime;
        e.patientFullName = r.patientFullName;
        e.patientEmail = r.patientEmail;
        e.patientPhoneNumber = r.patientPhoneNumber;
        e.patientReason = r.patientReason;

        return e;
    }

    public AppointmentResponse toResponse(AppointmentEntity e) {

        AppointmentResponse r = new AppointmentResponse();
        
        r.id = e.id;
        r.startDateTime = e.startDateTime.toString();
        r.durationInSeconds = e.durationInSeconds;
        r.appointmentStatus = e.appointmentStatus;
        r.location = e.location;
        r.previousAppointmentId = e.previousAppointmentId;
        r.patientFullName = e.patientFullName;
        r.patientEmail = e.patientEmail;
        r.patientPhoneNumber = e.patientPhoneNumber;
        r.patientReason = e.patientReason;
        r.clinicianNotes = e.clinicianNotes;
        r.isAcknowledged = e.isAcknowledged;
        r.createdAt = e.createdAt.toString();
        r.updatedAt = e.updatedAt.toString();

        return r;
    }

    public void updateEntityFromRequest(AppointmentEntity e, ClinicianAppointmentRequest r) {

        e.startDateTime = r.startDateTime != null ? r.startDateTime : e.startDateTime;
        e.patientFullName = r.patientFullName != null ? r.patientFullName : e.patientFullName;
        e.patientEmail = r.patientEmail != null ? r.patientEmail : e.patientEmail;
        e.patientPhoneNumber = r.patientPhoneNumber != null ? r.patientPhoneNumber : e.patientPhoneNumber;
        e.patientReason = r.patientReason != null ? r.patientReason : e.patientReason;

        e.durationInSeconds = r.durationInSeconds != null ? r.durationInSeconds : e.durationInSeconds;
        e.appointmentStatus = r.appointmentStatus != null ? r.appointmentStatus : e.appointmentStatus;
        e.location = r.location != null ? r.location : e.location;
        e.previousAppointmentId = r.previousAppointmentId != null ? r.previousAppointmentId : e.previousAppointmentId;
        e.clinicianNotes = r.clinicianNotes != null ? r.clinicianNotes : e.clinicianNotes;
        e.isAcknowledged = r.isAcknowledged != null ? r.isAcknowledged : e.isAcknowledged;

    }
    
}
