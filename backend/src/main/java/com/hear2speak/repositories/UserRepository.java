package com.hear2speak.repositories;

import com.hear2speak.entities.UserEntity;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class UserRepository implements PanacheRepository<UserEntity> {
    
}
