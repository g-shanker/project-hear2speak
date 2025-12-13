package com.hear2speak.services;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

import com.hear2speak.dtos.auth.LoginRequest;
import com.hear2speak.dtos.auth.TokenResponse;
import com.hear2speak.dtos.user.ChangePasswordRequest;
import com.hear2speak.dtos.user.RegisterRequest;
import com.hear2speak.dtos.user.UserResponse;
import com.hear2speak.entities.user.UserEntity;
import com.hear2speak.mappers.UserMapper;
import com.hear2speak.repositories.UserRepository;

import io.quarkus.elytron.security.common.BcryptUtil;
import io.quarkus.security.identity.SecurityIdentity;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
public class UserService {

    @ConfigProperty(name = "app.constants.users.jwt-lifetime", defaultValue = "300")
    int JWT_LIFETIME;

    @ConfigProperty(name = "mp.jwt.verify.issuer")
    String ISSUER;
    
    private final UserRepository userRepository;

    private final SecurityIdentity securityIdentity;

    private final UserMapper userMapper;

    @Inject
    public UserService(
        UserRepository userRepository,
        SecurityIdentity securityIdentity,
        UserMapper userMapper
    ) {
        this.userRepository = userRepository;
        this.securityIdentity = securityIdentity;
        this.userMapper = userMapper;
    }

    public UserEntity findByUsername(String username) {
        return userRepository.find("username", username).firstResult();
    }

    public TokenResponse authenticate(LoginRequest loginRequest) {
        UserEntity userEntity = findByUsername(loginRequest.username);

        if(userEntity == null) {
            throw new WebApplicationException("Username or password is incorrect", Response.Status.UNAUTHORIZED.getStatusCode());
        }

        if(!BcryptUtil.matches(loginRequest.password, userEntity.password)) {
            throw new WebApplicationException("Username or password is incorrect", Response.Status.UNAUTHORIZED.getStatusCode());
        }

        TokenResponse tokenResponse = new TokenResponse();
        tokenResponse.token = Jwt.issuer(ISSUER)
                                .upn(userEntity.username)
                                .groups(new HashSet<>(Arrays.asList(userEntity.role.toString())))
                                .expiresIn(JWT_LIFETIME)
                                .sign();

        return tokenResponse;
    }

    public UserEntity getCurrentUserEntity() {
        String username = securityIdentity.getPrincipal().getName();
        UserEntity user = findByUsername(username);
        return user;
    }

    public UserResponse getCurrentUser() {
        UserEntity userEntity = getCurrentUserEntity();
        UserResponse userResponse = userMapper.toResponse(userEntity);
        return userResponse;
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        UserEntity userEntity = getCurrentUserEntity();

        if (userEntity == null) {
            throw new WebApplicationException("User does not exist", Response.Status.NOT_FOUND.getStatusCode());
        }

        if (!BcryptUtil.matches(request.oldPassword, userEntity.password)) {
            throw new WebApplicationException("Old password is incorrect", Response.Status.BAD_REQUEST.getStatusCode());
        }

        userEntity.password = BcryptUtil.bcryptHash(request.newPassword);
    }

    public List<UserResponse> listAllUsers() {
        List<UserEntity> userEntities = userRepository.listAll();
        List<UserResponse> userResponses = userEntities.stream()
            .map(userMapper::toResponse)
            .collect(Collectors.toList());
        return userResponses;
    }

    @Transactional
    public void registerUser(RegisterRequest registerRequest) {
        
        if(findByUsername(registerRequest.username) != null) {
            throw new WebApplicationException("User with username " + registerRequest.username + " already exists", Response.Status.CONFLICT.getStatusCode());
        }
        
        UserEntity userEntity = new UserEntity();
        userEntity.username = registerRequest.username;
        userEntity.password = BcryptUtil.bcryptHash(registerRequest.password);
        userEntity.role = registerRequest.role;
        userRepository.persist(userEntity);
    }

    @Transactional
    public void deleteUser(String username) {
        boolean isDeleted = userRepository.delete("username", username) > 0;
        if(!isDeleted) {
            throw new WebApplicationException("User with username " + username + " not found.", Response.Status.NOT_FOUND.getStatusCode());
        }
        return;
    }

    @Transactional
    public void forceResetPassword(String username, String newPassword) {
        UserEntity userEntity = findByUsername(username);
        if(userEntity == null) {
            throw new WebApplicationException("User with username " + username + " not found.", Response.Status.NOT_FOUND.getStatusCode());
        }
        userEntity.password = BcryptUtil.bcryptHash(newPassword);
        return;
    }

}
