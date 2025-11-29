package com.hear2speak.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ChangePasswordRequest {
    
    @NotBlank(message = "Old password is required")
    public String oldPassword;
    
    @NotBlank(message = "New password is required")
    @Size(min = 8, max = 100, message = "New password must be at least 8 characters long")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$", message = "Password too weak")
    public String newPassword;

}
