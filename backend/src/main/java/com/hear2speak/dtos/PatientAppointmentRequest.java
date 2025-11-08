package com.hear2speak.dtos;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class PatientAppointmentRequest {

    // Mandatory fields
    
    @NotNull
    public LocalDateTime startDateTime;

    @NotBlank
    @Size(min = 2)
    public String patientFullName;

    @NotBlank
    @Email
    public String patientEmail;

    @NotBlank
    @Pattern(regexp = "\\d{10}", message = "Must be exactly 10 digits")
    public String patientPhoneNumber;

    @NotNull
    @Size(min = 3, max = 1000)
    public String patientReason;

}
