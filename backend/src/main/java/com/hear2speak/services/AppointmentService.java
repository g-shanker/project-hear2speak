package com.hear2speak.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.hear2speak.dtos.ClinicianAppointmentRequest;
import com.hear2speak.dtos.AppointmentResponse;
import com.hear2speak.entities.AppointmentEntity;
import com.hear2speak.mappers.AppointmentMapper;
import com.hear2speak.repositories.AppointmentRepository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    private final AppointmentMapper appointmentMapper;

    @Inject
    public AppointmentService(
        AppointmentRepository appointmentRepository,
        AppointmentMapper appointmentMapper
    ) {
        this.appointmentRepository = appointmentRepository;
        this.appointmentMapper = appointmentMapper;
    }

    public List<AppointmentResponse> getAllAppointments() {
        List<AppointmentEntity> appointmentEntities = appointmentRepository.listAll();
        List<AppointmentResponse> appointmentResponses = appointmentEntities.stream()
            .map(appointmentMapper::toResponse)
            .collect(Collectors.toList());
        return appointmentResponses;
    }

    public AppointmentResponse getAppointmentById(Long id) {
        AppointmentEntity appointmentEntity = appointmentRepository.findByIdOptional(id)
            .orElseThrow(() -> new WebApplicationException("Appointment with id " + id + " not found.", Response.Status.NOT_FOUND.getStatusCode()));

        AppointmentResponse appointmentResponse = appointmentMapper.toResponse(appointmentEntity);
        return appointmentResponse;
    }

    @Transactional
    public AppointmentResponse createAppointment(ClinicianAppointmentRequest appointmentRequest) {
        AppointmentEntity appointmentEntity = appointmentMapper.toEntity(appointmentRequest);
        appointmentRepository.persist(appointmentEntity);
        AppointmentResponse appointmentResponse = appointmentMapper.toResponse(appointmentEntity);
        return appointmentResponse;
    }

    @Transactional
    public boolean deleteAppointment(Long id) {
        return appointmentRepository.deleteById(id);
    }

    @Transactional
    public AppointmentResponse updateAppointment(Long id, ClinicianAppointmentRequest appointmentRequest) {
        AppointmentEntity appointmentEntity = appointmentRepository.findByIdOptional(id)
            .orElseThrow(() -> new WebApplicationException("Appointment with id " + id + " not found.", Response.Status.NOT_FOUND.getStatusCode()));

        appointmentMapper.updateEntityFromRequest(appointmentEntity, appointmentRequest);
        appointmentEntity.updatedAt = LocalDateTime.now();

        AppointmentResponse appointmentResponse = appointmentMapper.toResponse(appointmentEntity);

        return appointmentResponse;
    }

}
