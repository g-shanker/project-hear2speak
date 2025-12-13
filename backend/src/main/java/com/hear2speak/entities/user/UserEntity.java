package com.hear2speak.entities.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class UserEntity {

    @Id
    @GeneratedValue
    public Long id;

    @Column(name = "username", unique = true, nullable = false)
    public String username;

    @Column(name = "password", nullable = false)
    public String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    public UserRole role;
    
}
