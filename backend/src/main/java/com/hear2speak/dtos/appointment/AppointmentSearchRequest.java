package com.hear2speak.dtos.appointment;

import java.time.LocalDateTime;

import com.hear2speak.entities.appointment.AppointmentStatus;

public class AppointmentSearchRequest {

    // sort parameters

    public String sortField;

    public Boolean ascending;

    // search parameters

    public String globalText;

    public LocalDateTime startDateFrom;

    public LocalDateTime startDateTo;
    
    public AppointmentStatus appointmentStatus;

    // pagination

    public Integer page = 0;

    public Integer size = 20;

}
