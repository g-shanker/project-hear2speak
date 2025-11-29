package com.hear2speak.auth;

import java.util.logging.Logger;

import com.hear2speak.dtos.RegisterRequest;
import com.hear2speak.services.UserService;

import io.quarkus.runtime.StartupEvent;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class AuthSeeder {

    private static final Logger LOG = Logger.getLogger(AuthSeeder.class.getName());

    private final UserService userService;

    @ConfigProperty(name = "app.admin.initial-password", defaultValue = "password123")
    String initialPassword;

    @ConfigProperty(name = "app.admin.seeding-enabled", defaultValue = "false")
    boolean seedingEnabled;

    @Inject
    public AuthSeeder(UserService userService) {
        this.userService = userService;
    }

    @Transactional
    public void loadUsers(@Observes StartupEvent event) {
        if (!seedingEnabled) return;

        RegisterRequest request = new RegisterRequest();
        request.username = "admin";
        request.password = initialPassword;
        request.role = "admin";

        if(userService.registerUser(request)) {
            LOG.info("--- Initial Admin User Created. ---");
        }
    }
    
}
