package com.hear2speak.dtos;

import java.time.LocalDateTime;

import com.hear2speak.entities.AppointmentStatus;

public class AppointmentSearchRequest {

    // sort parameters

    public String sortField;

    public Boolean ascending;

    // search parameters

    public String globalText;

    public LocalDateTime startDateFrom;

    public LocalDateTime startDateTo;
    
    public AppointmentStatus appointmentStatus;

}
