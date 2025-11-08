package com.hear2speak.dtos;

import com.hear2speak.entities.AppointmentStatus;

public class AppointmentResponse {

    public Long id;
    
    public String startDateTime;

    public Integer durationInSeconds;

    public AppointmentStatus appointmentStatus;

    public String location;

    public Long previousAppointmentId;

    public String patientFullName;

    public String patientEmail;

    public String patientPhoneNumber;

    public String patientReason;

    public String clinicianNotes;

    public Boolean isAcknowledged;

    public String createdAt;

    public String updatedAt;

}
