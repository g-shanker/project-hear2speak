package com.hear2speak.controllers;

import java.util.List;

import com.hear2speak.dtos.ClinicianAppointmentRequest;
import com.hear2speak.dtos.AppointmentResponse;
import com.hear2speak.services.AppointmentService;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/appointments")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AppointmentController {

    private final AppointmentService appointmentService;

    @Inject
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GET
    public Response listAllAppointments() {
        List<AppointmentResponse> appointmentResponses = appointmentService.getAllAppointments();
        return Response.status(Response.Status.OK).entity(appointmentResponses).build();
    }

    @GET
    @Path("/{id}")
    public Response getAppointmentById(Long id) {
        AppointmentResponse appointmentResponse = appointmentService.getAppointmentById(id);
        return Response.status(Response.Status.OK).entity(appointmentResponse).build();
    }

    @POST
    public Response createAppointment(@Valid ClinicianAppointmentRequest appointmentRequest) {
        AppointmentResponse appointmentResponse = appointmentService.createAppointment(appointmentRequest);
        return Response.status(Response.Status.CREATED).entity(appointmentResponse).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteAppointment(Long id) {
        boolean isDeleted = appointmentService.deleteAppointment(id);
        if(isDeleted) {
            return Response.noContent().build();
        }
        else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

}
