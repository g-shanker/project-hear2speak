package com.hear2speak.repositories;

import com.hear2speak.entities.AppointmentEntity;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class AppointmentRepository implements PanacheRepository<AppointmentEntity> {

}
