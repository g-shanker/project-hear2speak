package com.hear2speak.entities.appointment;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

@Entity
public class AppointmentEntity {

    @Id
    @GeneratedValue
    @Column(name = "id", updatable = false)
    public Long id;

    // Appointment details

    @Column(name = "start_date_time")
    public LocalDateTime startDateTime;

    @Column(name = "duration_in_seconds")
    public Integer durationInSeconds;

    @Column(name = "appointment_status")
    @Enumerated(EnumType.STRING)
    public AppointmentStatus appointmentStatus;

    // Patient details

    @Column(name = "patient_full_name")
    public String patientFullName;

    @Column(name = "patient_email")
    public String patientEmail;

    @Column(name = "patient_phone_number")
    public String patientPhoneNumber;

    @Column(name = "patient_reason", length = 1000)
    public String patientReason;

    @Column(name = "clinician_notes", length = 1000)
    public String clinicianNotes;

    // Audit fields

    @Column(name = "is_acknowledged")
    public Boolean isAcknowledged = false;

    @Column(name = "created_at", updatable = false)
    public LocalDateTime createdAt;

    @Column(name = "updated_at")
    public LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

}
