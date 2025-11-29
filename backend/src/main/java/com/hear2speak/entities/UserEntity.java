package com.hear2speak.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class UserEntity {

    @Id
    @GeneratedValue
    public Long id;

    @Column(unique = true, nullable = false)
    public String username;

    @Column(nullable = false)
    public String password;

    public String role;
    
}
