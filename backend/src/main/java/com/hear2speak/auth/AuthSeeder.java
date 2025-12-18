package com.hear2speak.auth;

import java.util.logging.Logger;

import com.hear2speak.dtos.user.RegisterRequest;
import com.hear2speak.entities.user.UserRole;
import com.hear2speak.services.UserService;

import io.quarkus.runtime.StartupEvent;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class AuthSeeder {

    @ConfigProperty(name = "app.admin.initial-password", defaultValue = "admin")
    String initialPassword;

    @ConfigProperty(name = "app.admin.seeding-enabled", defaultValue = "false")
    boolean seedingEnabled;

    private static final Logger LOG = Logger.getLogger(AuthSeeder.class.getName());

    private final UserService userService;

    @Inject
    public AuthSeeder(UserService userService) {
        this.userService = userService;
    }

    @Transactional
    public void loadUsers(@Observes StartupEvent event) {
        if (!seedingEnabled) return;

        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.username = "admin";
        registerRequest.password = initialPassword;
        registerRequest.role = UserRole.ADMIN;

        if(userService.findByUsername(registerRequest.username) != null) return;

        userService.registerUser(registerRequest);
        LOG.info("--- Initial Admin User Created. ---");
        LOG.info("Username: admin, Password: " + initialPassword);
        LOG.info("-----------------------------------");
    }
    
}
