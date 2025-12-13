package com.hear2speak.dtos.appointment;

import java.time.LocalDateTime;

import com.hear2speak.entities.appointment.AppointmentStatus;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CreateAppointmentRequest {
    
    // Appointment details
    
    @NotNull
    public LocalDateTime startDateTime;

    public Integer durationInSeconds;

    public AppointmentStatus appointmentStatus;

    // Patient details

    @NotBlank
    public String patientFullName;

    @NotBlank
    @Email
    public String patientEmail;

    @NotBlank
    @Pattern(regexp = "\\d{10}", message = "Must be exactly 10 digits")
    public String patientPhoneNumber;

    @NotBlank
    @Size(min = 3, max = 1000)
    public String patientReason;

    @Size(max = 1000)
    public String clinicianNotes;

    // Audit details

    public Boolean isAcknowledged;

}
