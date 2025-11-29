package com.hear2speak.services;

import java.util.Arrays;
import java.util.HashSet;
import java.util.logging.Logger;

import com.hear2speak.dtos.ChangePasswordRequest;
import com.hear2speak.dtos.LoginRequest;
import com.hear2speak.dtos.RegisterRequest;
import com.hear2speak.entities.UserEntity;
import com.hear2speak.repositories.UserRepository;

import io.quarkus.elytron.security.common.BcryptUtil;
import io.quarkus.security.identity.SecurityIdentity;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class UserService {
    
    private final UserRepository userRepository;

    private final SecurityIdentity securityIdentity;

    @ConfigProperty(name = "mp.jwt.verify.issuer")
    String issuer;

    private static final Logger LOG = Logger.getLogger(UserService.class.getName());

    @Inject
    public UserService(
        UserRepository userRepository,
        SecurityIdentity securityIdentity
    ) {
        this.userRepository = userRepository;
        this.securityIdentity = securityIdentity;
    }

    public UserEntity findByUsername(String username) {
        return userRepository.find("username", username).firstResult();
    }

    @Transactional
    public boolean registerUser(RegisterRequest registerRequest) {
        
        if(findByUsername(registerRequest.username) != null) {
            return false;
        }
        
        UserEntity user = new UserEntity();
        user.username = registerRequest.username;
        user.password = BcryptUtil.bcryptHash(registerRequest.password);
        user.role = registerRequest.role;
        userRepository.persist(user);

        return true;
    }

    public boolean isValidUser(String username, String password) {
        UserEntity user = findByUsername(username);
        return user != null && BcryptUtil.matches(password, user.password);
    }

    public String authenticate(LoginRequest loginRequest) {
        UserEntity user = findByUsername(loginRequest.username);

        if(user == null) {
            LOG.info(">>> LOGIN FAILED: User '" + loginRequest.username + "' not found in Database.");
            return null;
        }

        if(!BcryptUtil.matches(loginRequest.password, user.password)) {
            LOG.info(">>> LOGIN FAILED: Password mismatch for user '" + loginRequest.username + "'.");
            LOG.info(">>> Input: " + loginRequest.password); // Be careful with this in prod!
            LOG.info(">>> Stored Hash: " + user.password);
            return null;
        }

        return Jwt.issuer(issuer)
                .upn(user.username)
                .groups(new HashSet<>(Arrays.asList(user.role)))
                .expiresIn(3600)
                .sign();
    }

    @Transactional
    public boolean changePassword(ChangePasswordRequest changePasswordRequest) {
        UserEntity user = getCurrentUser();

        if(user == null) {
            return false;
        }

        if(!BcryptUtil.matches(changePasswordRequest.oldPassword, user.password)) {
            return false;
        }

        user.password = BcryptUtil.bcryptHash(changePasswordRequest.newPassword);
        
        return true;
    }

    public UserEntity getCurrentUser() {
        String username = securityIdentity.getPrincipal().getName();
        UserEntity user = findByUsername(username);
        return user;
    }

}
