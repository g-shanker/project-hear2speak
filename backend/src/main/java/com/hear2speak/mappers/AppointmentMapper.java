package com.hear2speak.mappers;

import com.hear2speak.dtos.appointment.AppointmentResponse;
import com.hear2speak.dtos.appointment.CreateAppointmentRequest;
import com.hear2speak.dtos.appointment.UpdateAppointmentRequest;
import com.hear2speak.entities.appointment.AppointmentEntity;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class AppointmentMapper {

    public AppointmentEntity toEntity(CreateAppointmentRequest r) {
        
        AppointmentEntity e = new AppointmentEntity();

        // Appointment details

        e.startDateTime = r.startDateTime;
        e.durationInSeconds = r.durationInSeconds;
        e.appointmentStatus = r.appointmentStatus;

        // Patient details

        e.patientFullName = r.patientFullName;
        e.patientEmail = r.patientEmail;
        e.patientPhoneNumber = r.patientPhoneNumber;
        e.patientReason = r.patientReason;
        e.clinicianNotes = r.clinicianNotes;

        // Audit details

        e.isAcknowledged = r.isAcknowledged;

        return e;

    }

    public void updateEntity(AppointmentEntity e, UpdateAppointmentRequest r) {

        // Appointment details
        
        e.startDateTime = r.startDateTime != null ? r.startDateTime : e.startDateTime;
        e.durationInSeconds = r.durationInSeconds != null ? r.durationInSeconds : e.durationInSeconds;
        e.appointmentStatus = r.appointmentStatus != null ? r.appointmentStatus : e.appointmentStatus;

        // Patient details

        e.patientFullName = r.patientFullName != null ? r.patientFullName : e.patientFullName;
        e.patientEmail = r.patientEmail != null ? r.patientEmail : e.patientEmail;
        e.patientPhoneNumber = r.patientPhoneNumber != null ? r.patientPhoneNumber : e.patientPhoneNumber;
        e.patientReason = r.patientReason != null ? r.patientReason : e.patientReason;
        e.clinicianNotes = r.clinicianNotes != null ? r.clinicianNotes : e.clinicianNotes;

        // Audit details

        e.isAcknowledged = r.isAcknowledged != null ? r.isAcknowledged : e.isAcknowledged;
        
    }

    public AppointmentResponse toResponse(AppointmentEntity e) {

        AppointmentResponse r = new AppointmentResponse();
        
        r.id = e.id;

        // Appointment details

        r.startDateTime = e.startDateTime.toString();
        r.durationInSeconds = e.durationInSeconds;
        r.appointmentStatus = e.appointmentStatus;

        // Patient details

        r.patientFullName = e.patientFullName;
        r.patientEmail = e.patientEmail;
        r.patientPhoneNumber = e.patientPhoneNumber;
        r.patientReason = e.patientReason;
        r.clinicianNotes = e.clinicianNotes;

        // Audit details
        
        r.isAcknowledged = e.isAcknowledged;
        r.createdAt = e.createdAt.toString();
        r.updatedAt = e.updatedAt.toString();

        return r;

    }

}
