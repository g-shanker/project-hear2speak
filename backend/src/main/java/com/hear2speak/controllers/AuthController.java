package com.hear2speak.controllers;

import com.hear2speak.dtos.auth.LoginRequest;
import com.hear2speak.dtos.auth.TokenResponse;
import com.hear2speak.services.UserService;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
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
        TokenResponse tokenResponse = userService.authenticate(request);
        return Response.status(Response.Status.OK).entity(tokenResponse).build();
    }

}
