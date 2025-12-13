package com.hear2speak.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import com.hear2speak.dtos.appointment.AppointmentResponse;
import com.hear2speak.dtos.appointment.AppointmentSearchRequest;
import com.hear2speak.dtos.appointment.CreateAppointmentRequest;
import com.hear2speak.dtos.appointment.UpdateAppointmentRequest;
import com.hear2speak.entities.appointment.AppointmentEntity;
import com.hear2speak.entities.appointment.AppointmentStatus;
import com.hear2speak.mappers.AppointmentMapper;
import com.hear2speak.repositories.AppointmentRepository;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Sort;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
public class AppointmentService {

    @ConfigProperty(name = "app.constants.appointments.allowed-sort-fields")
    Set<String> ALLOWED_SORT_FIELDS;

    @ConfigProperty(name = "app.constants.appointments.default-sort-field", defaultValue = "createdAt")
    String DEFAULT_SORT_FIELD;

    @ConfigProperty(name = "app.constants.appointments.default-sort-field", defaultValue = "false")
    boolean DEFAULT_SORT_ASCENDING;

    @ConfigProperty(name = "app.constants.appointments.default-duration-in-seconds", defaultValue = "1800")
    int DEFAULT_DURATION_IN_SECONDS;

    @ConfigProperty(name = "app.constants.appointments.default-patient-logged-appointment-status")
    AppointmentStatus DEFAULT_PATIENT_LOGGED_APPOINTMENT_STATUS;

    @ConfigProperty(name = "app.constants.appointments.default-clinician-logged-appointment-status")
    AppointmentStatus DEFAULT_CLINICIAN_LOGGED_APPOINTMENT_STATUS;

    private final AppointmentRepository appointmentRepository;

    private final AppointmentMapper appointmentMapper;

    private final SecurityIdentity securityIdentity;

    @Inject
    public AppointmentService(
        AppointmentRepository appointmentRepository,
        AppointmentMapper appointmentMapper,
        SecurityIdentity securityIdentity
    ) {
        this.appointmentRepository = appointmentRepository;
        this.appointmentMapper = appointmentMapper;
        this.securityIdentity = securityIdentity;
    }

    public List<AppointmentResponse> searchAppointments(AppointmentSearchRequest appointmentSearchRequest) {
        if(appointmentSearchRequest == null) {
            appointmentSearchRequest = new AppointmentSearchRequest();
        }

        Map<String, Object> parameters = new HashMap<>();
        List<String> conditions = new ArrayList<>();

        if(appointmentSearchRequest.globalText != null && !appointmentSearchRequest.globalText.isBlank()) {
            String searchPattern = "%" + appointmentSearchRequest.globalText.trim().toLowerCase() + "%";

            conditions.add("""
                (
                    LOWER(patientFullName) LIKE :globalText
                    OR LOWER(patientEmail) LIKE :globalText
                    OR LOWER(patientPhoneNumber) LIKE :globalText
                    OR LOWER(patientReason) LIKE :globalText
                    OR LOWER(clinicianNotes) LIKE :globalText
                )
            """);
            parameters.put("globalText", searchPattern);
        }

        if(appointmentSearchRequest.startDateFrom != null) {
            conditions.add("startDateTime >= :startDateFrom");
            parameters.put("startDateFrom", appointmentSearchRequest.startDateFrom);
        }

        if(appointmentSearchRequest.startDateTo != null) {
            conditions.add("startDateTime <= :startDateTo");
            parameters.put("startDateTo", appointmentSearchRequest.startDateTo);
        }

        if(appointmentSearchRequest.appointmentStatus != null) {
            conditions.add("appointmentStatus = :status");
            parameters.put("status", appointmentSearchRequest.appointmentStatus);
        }

        String query = String.join(" AND ", conditions);

        if(appointmentSearchRequest.sortField != null && !ALLOWED_SORT_FIELDS.contains(appointmentSearchRequest.sortField)) {
            throw new WebApplicationException("Unsupported sort field: " + appointmentSearchRequest.sortField, Response.Status.BAD_REQUEST.getStatusCode());
        }

        String sortColumn = appointmentSearchRequest.sortField != null ? appointmentSearchRequest.sortField : DEFAULT_SORT_FIELD;
        Sort sort = Sort.by(sortColumn).direction(
            (appointmentSearchRequest.ascending != null && appointmentSearchRequest.ascending) ? Sort.Direction.Ascending : Sort.Direction.Descending
        );

        PanacheQuery<AppointmentEntity> panacheQuery = appointmentRepository.find(query, sort, parameters);

        if(appointmentSearchRequest.page != null && appointmentSearchRequest.size != null) {
            panacheQuery.page(appointmentSearchRequest.page, appointmentSearchRequest.size);
        }

        return panacheQuery.list()
                .stream()
                .map(appointmentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AppointmentResponse createAppointment(CreateAppointmentRequest appointmentRequest) {
        AppointmentEntity appointmentEntity = appointmentMapper.toEntity(appointmentRequest);
        appointmentEntity = applyDefaults(appointmentEntity);
        appointmentRepository.persist(appointmentEntity);
        AppointmentResponse appointmentResponse = appointmentMapper.toResponse(appointmentEntity);
        return appointmentResponse;
    }

    private AppointmentEntity applyDefaults(AppointmentEntity e) {
        if(e.durationInSeconds == null) {
            e.durationInSeconds = DEFAULT_DURATION_IN_SECONDS;
        }

        if(e.appointmentStatus == null) {
            e.appointmentStatus = securityIdentity.isAnonymous() ? DEFAULT_PATIENT_LOGGED_APPOINTMENT_STATUS : DEFAULT_CLINICIAN_LOGGED_APPOINTMENT_STATUS;
        }

        if(securityIdentity.isAnonymous()) {
            // Only authenticated personnel should be able to acknowledge appointments and set status
            e.durationInSeconds = DEFAULT_DURATION_IN_SECONDS;
            e.appointmentStatus = DEFAULT_PATIENT_LOGGED_APPOINTMENT_STATUS;
            e.clinicianNotes = null;
            e.isAcknowledged = false;
        }

        return e;
    }

    @Transactional
    public AppointmentResponse updateAppointment(Long id, UpdateAppointmentRequest appointmentRequest) {
        AppointmentEntity appointmentEntity = appointmentRepository.findByIdOptional(id)
            .orElseThrow(() -> new WebApplicationException("Appointment with id " + id + " not found.", Response.Status.NOT_FOUND.getStatusCode()));

        appointmentMapper.updateEntity(appointmentEntity, appointmentRequest);
        appointmentEntity.updatedAt = LocalDateTime.now();

        AppointmentResponse appointmentResponse = appointmentMapper.toResponse(appointmentEntity);

        return appointmentResponse;
    }
    
    @Transactional
    public void deleteAppointment(Long id) {
        boolean isDeleted = appointmentRepository.deleteById(id);
        if(!isDeleted) {
            throw new WebApplicationException("Appointment with id " + id + " not found.", Response.Status.NOT_FOUND.getStatusCode());
        }
        return;
    }

}
