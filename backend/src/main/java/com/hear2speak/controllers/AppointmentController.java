package com.hear2speak.controllers;

import java.util.List;

import com.hear2speak.dtos.ClinicianAppointmentRequest;
import com.hear2speak.dtos.PatientAppointmentRequest;
import com.hear2speak.dtos.AppointmentResponse;
import com.hear2speak.dtos.AppointmentSearchRequest;
import com.hear2speak.services.AppointmentService;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
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
    @Path("/search")
    public Response searchAppointments(AppointmentSearchRequest appointmentSearchRequest) {
        List<AppointmentResponse> appointmentResponses = appointmentService.searchAppointments(appointmentSearchRequest);
        return Response.status(Response.Status.OK).entity(appointmentResponses).build();
    }

    @POST
    @Path("/clinician")
    public Response createClinicianAppointment(@Valid ClinicianAppointmentRequest appointmentRequest) {
        AppointmentResponse appointmentResponse = appointmentService.createClinicianAppointment(appointmentRequest);
        return Response.status(Response.Status.CREATED).entity(appointmentResponse).build();
    }

    @POST
    @Path("/patient")
    public Response createPatientAppointment(@Valid PatientAppointmentRequest appointmentRequest) {
        AppointmentResponse appointmentResponse = appointmentService.createPatientAppointment(appointmentRequest);
        return Response.status(Response.Status.CREATED).entity(appointmentResponse).build();
    }

    @PUT
    @Path("/{id}")
    public Response updateAppointment(@PathParam("id") Long id, @Valid ClinicianAppointmentRequest appointmentRequest) {
        AppointmentResponse appointmentResponse = appointmentService.updateAppointment(id, appointmentRequest);
        return Response.status(Response.Status.OK).entity(appointmentResponse).build();
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
