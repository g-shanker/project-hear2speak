package com.hear2speak.services;

import java.util.List;

import com.hear2speak.entities.AppointmentEntity;
import com.hear2speak.repositories.AppointmentRepository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

@ApplicationScoped
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    @Inject
    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public List<AppointmentEntity> getAllAppointmentEntities() {
        return appointmentRepository.listAll();
    }

    public AppointmentEntity getAppointmentEntityById(Long id) {
        AppointmentEntity appointmentEntity = appointmentRepository.findById(id);
        if(appointmentEntity == null) {
            throw new NotFoundException("Appointment with id " + id + " not found.");
        }
        return appointmentEntity;
    }

    @Transactional
    public AppointmentEntity createAppointmentEntity(AppointmentEntity appointmentEntity) {
        appointmentRepository.persist(appointmentEntity);
        return appointmentEntity;
    }

    @Transactional
    public boolean deleteAppointmentEntity(Long id) {
        return appointmentRepository.deleteById(id);
    }

}
