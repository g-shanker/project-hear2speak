package com.hear2speak.dtos;

import com.hear2speak.entities.AppointmentStatus;

public class AppointmentResponse {

    public Long id;

    // Appointment details
    
    public String startDateTime;

    public Integer durationInSeconds;

    public AppointmentStatus appointmentStatus;

    // Patient details

    public String patientFullName;

    public String patientEmail;

    public String patientPhoneNumber;

    public String patientReason;

    public String clinicianNotes;

    // Audit details

    public Boolean isAcknowledged;

    public String createdAt;

    public String updatedAt;

}
