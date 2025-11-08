package com.hear2speak.controllers;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;
import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;

@QuarkusTest
public class AppointmentControllerTest {

    @Inject
    EntityManager entityManager;

    @BeforeEach
    @Transactional
    void setUp() {
        // Clear the database before each test
        entityManager.createQuery("DELETE FROM AppointmentEntity").executeUpdate();
    }

    @Test
    public void testListAllAppointments_Empty() {
        given()
            .when()
                .get("/api/appointments")
            .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("size()", equalTo(0));
    }
}
