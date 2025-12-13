package com.hear2speak.controllers;

import java.util.List;

import com.hear2speak.dtos.user.ChangePasswordRequest;
import com.hear2speak.dtos.user.ForceResetPasswordRequest;
import com.hear2speak.dtos.user.RegisterRequest;
import com.hear2speak.dtos.user.UserResponse;
import com.hear2speak.services.UserService;

import io.quarkus.security.Authenticated;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserController {

    private final UserService userService;

    @Inject
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @GET
    @Path("/me")
    @Authenticated
    public Response getCurrentUser() {
        UserResponse userResponse = userService.getCurrentUser();
        return Response.status(Response.Status.OK).entity(userResponse).build();
    }

    @PUT
    @Path("/me/reset-password")
    @Authenticated
    public Response changePassword(@Valid ChangePasswordRequest changePasswordRequest) {
        userService.changePassword(changePasswordRequest);
        return Response.status(Response.Status.OK).build();
    }

    @GET
    @RolesAllowed("ADMIN")
    public Response listUsers() {
        List<UserResponse> userResponses = userService.listAllUsers();
        return Response.status(Response.Status.OK).entity(userResponses).build();
    }

    @POST
    @RolesAllowed("ADMIN")
    public Response createUser(@Valid RegisterRequest registerRequest) {
        userService.registerUser(registerRequest);
        return Response.status(Response.Status.CREATED).build();
    }

    @DELETE
    @Path("/{username}")
    @RolesAllowed("ADMIN")
    public Response deleteUser(@PathParam("username") String username) {
        userService.deleteUser(username);
        return Response.status(Response.Status.OK).build();
    }

    @PUT
    @Path("/{username}/reset-password")
    @RolesAllowed("ADMIN")
    public Response forceResetPassword(@PathParam("username") String username, @Valid ForceResetPasswordRequest forceResetPasswordRequest) {
        userService.forceResetPassword(username, forceResetPasswordRequest.newPassword);
        return Response.status(Response.Status.OK).build();
    }

}
