package com.hear2speak.dtos.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ChangePasswordRequest {
    
    @NotBlank(message = "Old password is required")
    public String oldPassword;
    
    @NotBlank(message = "New password is required")
    @Size(min = 8, message = "New password must be at least 8 characters long")
    @Pattern(regexp = ".*[0-9].*", message = "New password must contain at least one digit")
    @Pattern(regexp = ".*[a-z].*", message = "New password must contain at least one lowercase letter")
    @Pattern(regexp = ".*[A-Z].*", message = "New password must contain at least one uppercase letter")
    @Pattern(regexp = ".*[^a-zA-Z0-9].*", message = "New password must contain at least one symbol")
    public String newPassword;

}
