package com.hear2speak.services;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import com.hear2speak.dtos.ClinicianAppointmentRequest;
import com.hear2speak.dtos.AppointmentResponse;
import com.hear2speak.dtos.AppointmentSearchRequest;
import com.hear2speak.entities.AppointmentEntity;
import com.hear2speak.mappers.AppointmentMapper;
import com.hear2speak.repositories.AppointmentRepository;

import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    private final AppointmentMapper appointmentMapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "startDateTime",
        "updatedAt",
        "createdAt"
    );

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

    public List<AppointmentResponse> searchAppointments(AppointmentSearchRequest appointmentSearchRequest) {
        StringBuilder query = new StringBuilder("1=1");
        Map<String, Object> parameters = new HashMap<>();

        if(appointmentSearchRequest == null) {
            appointmentSearchRequest = new AppointmentSearchRequest();
            appointmentSearchRequest.sortField = "createdAt";
            appointmentSearchRequest.ascending = false;
        }

        // filtering

        if(appointmentSearchRequest.globalText != null && !appointmentSearchRequest.globalText.isBlank()) {
            String globalText = "%" + appointmentSearchRequest.globalText.trim().toLowerCase() + "%";

            query.append("""
                    AND (
                        LOWER(patientFullName) LIKE :globalText
                        OR LOWER(patientEmail) LIKE :globalText
                        OR LOWER(patientPhoneNumber) LIKE :globalText
                        OR LOWER(patientReason) LIKE :globalText
                        OR LOWER(clinicianNotes) LIKE :globalText
                    )
                    """);

            parameters.put("globalText", globalText);
        }

        if(appointmentSearchRequest.startDateFrom != null) {
            query.append(" AND startDateTime >= :startDateFrom");
            parameters.put("startDateFrom", appointmentSearchRequest.startDateFrom);
        }

        if(appointmentSearchRequest.startDateTo != null) {
            query.append(" AND startDateTime <= :startDateTo");
            parameters.put("startDateTo", appointmentSearchRequest.startDateTo);
        }

        if(appointmentSearchRequest.appointmentStatus != null) {
            query.append(" AND appointmentStatus = :status");
            parameters.put("status", appointmentSearchRequest.appointmentStatus);
        }

        // sorting

        if(!ALLOWED_SORT_FIELDS.contains(appointmentSearchRequest.sortField)) {
            throw new WebApplicationException("Unsupported sort field: " + appointmentSearchRequest.sortField, Response.Status.BAD_REQUEST.getStatusCode());
        }

        String sortField = appointmentSearchRequest.sortField != null ? appointmentSearchRequest.sortField : "createdAt";
        boolean ascending = appointmentSearchRequest.ascending != null ? appointmentSearchRequest.ascending : false;;

        Sort sort = Sort.by(sortField).direction(ascending ? Sort.Direction.Ascending : Sort.Direction.Descending);

        List<AppointmentEntity> appointmentEntities = appointmentRepository.find(query.toString(), sort, parameters).list();
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
