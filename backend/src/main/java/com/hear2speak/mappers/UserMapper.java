package com.hear2speak.mappers;

import com.hear2speak.dtos.user.UserResponse;
import com.hear2speak.entities.user.UserEntity;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class UserMapper {
    
    public UserResponse toResponse(UserEntity e) {
        
        UserResponse r = new UserResponse();

        r.username = e.username;
        r.role = e.role;

        return r;
        
    }

}
