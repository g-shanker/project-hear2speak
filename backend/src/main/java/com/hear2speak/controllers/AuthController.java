package com.hear2speak.controllers;

import com.hear2speak.dtos.ChangePasswordRequest;
import com.hear2speak.dtos.LoginRequest;
import com.hear2speak.dtos.RegisterRequest;
import com.hear2speak.dtos.TokenResponse;
import com.hear2speak.dtos.UserResponse;
import com.hear2speak.entities.UserEntity;
import com.hear2speak.services.UserService;

import io.quarkus.security.Authenticated;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthController {
    
    private final UserService userService;

    @Inject
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @POST
    @Path("/login")
    public Response login(@Valid LoginRequest request) {
        String token = userService.authenticate(request);
        if(token != null) {
            return Response.ok(new TokenResponse(token)).build();
        }
        else {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
    }

    @POST
    @Path("/register")
    @RolesAllowed("admin")
    public Response register(@Valid RegisterRequest request) {
        if(userService.registerUser(request)) {
            return Response.status(Response.Status.CREATED).build();
        }
        else {
            return Response.status(Response.Status.CONFLICT).entity("Username already exists.").build();
        }
    }

    @PUT
    @Path("/password")
    @Authenticated
    public Response changePassword(@Valid ChangePasswordRequest request) {
        boolean success = userService.changePassword(request);
        if(success) {
            return Response.ok().build();
        }
        else {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }

    @GET
    @Path("/me")
    @Authenticated
    public Response getCurrentUser() {
        UserEntity user = userService.getCurrentUser();
        if(user == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        else {
            return Response.ok(new UserResponse(user.username, user.role)).build();
        }
    }

}
