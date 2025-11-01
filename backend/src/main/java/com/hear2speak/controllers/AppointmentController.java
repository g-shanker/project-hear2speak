package com.hear2speak.controllers;

import java.util.List;

import com.hear2speak.entities.AppointmentEntity;
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

@Path("/appointments")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AppointmentController {

    private final AppointmentService appointmentService;

    @Inject
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GET
    public List<AppointmentEntity> listAll() {
        return appointmentService.getAllAppointmentEntities();
    }

    @GET
    @Path("/{id}")
    public AppointmentEntity getById(Long id) {
        return appointmentService.getAppointmentEntityById(id);
    }

    @POST
    public Response create(@Valid AppointmentEntity appointmentEntity) {
        AppointmentEntity createdAppointmentEntity = appointmentService.createAppointmentEntity(appointmentEntity);
        return Response.status(Response.Status.CREATED).entity(createdAppointmentEntity).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteById(Long id) {
        boolean isDeleted = appointmentService.deleteAppointmentEntity(id);
        if(isDeleted) {
            return Response.noContent().build();
        }
        else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

}
