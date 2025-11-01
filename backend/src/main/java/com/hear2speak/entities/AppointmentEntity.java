package com.hear2speak.entities;

import java.time.Duration;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
public class AppointmentEntity {

    @Id
    @GeneratedValue
    public Long id;

    @NotNull
    @Column(name = "state_date_time")
    public LocalDateTime startDateTime;

    @NotBlank
    @Size(min = 2)
    @Column(name = "patient_full_name")
    public String patientFullName;

    @NotBlank
    @Email
    @Column(name = "patient_email")
    public String patientEmail;

    @NotBlank
    @Size(min = 10, max = 10)
    @Column(name = "patient_phone_number")
    public String patientPhoneNumber;

    @NotNull
    @Column(name = "reason", length = 500)
    public String reason;

    @NotNull
    public Duration duration;
}
