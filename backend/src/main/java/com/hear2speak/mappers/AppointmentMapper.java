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
        e.previousAppointmentId = r.previousAppointmentId; // stays null until explicity set
        e.clinicianNotes = r.clinicianNotes != null ? r.clinicianNotes : e.clinicianNotes;

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
    
}
