package com.hear2speak.exceptions;

import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class GlobalExceptionMapper implements ExceptionMapper<Throwable> {
    
    @Context
    UriInfo uriInfo;

    @Override
    public Response toResponse(Throwable ex) {
        
        int status;
        String error;

        if(ex instanceof WebApplicationException wae) {
            status = wae.getResponse().getStatus();
            error = Response.Status.fromStatusCode(status).getReasonPhrase();
        }
        else if (ex instanceof IllegalArgumentException) {
            status = Response.Status.BAD_REQUEST.getStatusCode();
            error = "Bad Request";
        }
        else {
            status = Response.Status.INTERNAL_SERVER_ERROR.getStatusCode();
            error = "Internal Server Error";
        }

        ApiError apiError = new ApiError(
            status,
            error,
            ex.getMessage(),
            uriInfo != null ? uriInfo.getPath() : "N/A"
        );

        return Response.status(status).entity(apiError).build();

    }

}
