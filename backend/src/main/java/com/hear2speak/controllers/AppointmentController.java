package com.hear2speak.controllers;

import java.util.List;

import com.hear2speak.dtos.appointment.AppointmentResponse;
import com.hear2speak.dtos.appointment.AppointmentSearchRequest;
import com.hear2speak.dtos.appointment.CreateAppointmentRequest;
import com.hear2speak.dtos.appointment.UpdateAppointmentRequest;
import com.hear2speak.services.AppointmentService;

import io.quarkus.security.Authenticated;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/appointments")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AppointmentController {

    private final AppointmentService appointmentService;

    @Inject
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @POST
    @PermitAll
    public Response createAppointment(@Valid CreateAppointmentRequest appointmentRequest) {
        AppointmentResponse appointmentResponse = appointmentService.createAppointment(appointmentRequest);
        return Response.status(Response.Status.CREATED).entity(appointmentResponse).build();
    }

    @PUT
    @Path("/{id}")
    @Authenticated
    public Response updateAppointment(@PathParam("id") Long id, @Valid UpdateAppointmentRequest appointmentRequest) {
        AppointmentResponse appointmentResponse = appointmentService.updateAppointment(id, appointmentRequest);
        return Response.status(Response.Status.OK).entity(appointmentResponse).build();
    }

    @DELETE
    @Path("/{id}")
    @Authenticated
    public Response deleteAppointment(@PathParam("id") Long id) {
        appointmentService.deleteAppointment(id);
        return Response.status(Response.Status.OK).build();
    }

    @POST
    @Path("/search")
    @Authenticated
    public Response searchAppointments(AppointmentSearchRequest appointmentSearchRequest) {
        List<AppointmentResponse> appointmentResponses = appointmentService.searchAppointments(appointmentSearchRequest);
        return Response.status(Response.Status.OK).entity(appointmentResponses).build();
    }

}
