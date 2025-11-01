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
import java.time.LocalDateTime;
import java.time.Duration;
import com.hear2speak.entities.AppointmentEntity;

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

    private AppointmentEntity createSampleAppointment() {
        AppointmentEntity appointment = new AppointmentEntity();
        appointment.startDateTime = LocalDateTime.now().plusDays(1);
        appointment.patientFullName = "John Doe";
        appointment.patientEmail = "john.doe@example.com";
        appointment.patientPhoneNumber = "1234567890";
        appointment.reason = "Regular checkup";
        appointment.duration = Duration.ofMinutes(30);
        return appointment;
    }

    @Test
    public void testListAllAppointments_Empty() {
        given()
            .when()
                .get("/appointments")
            .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("size()", equalTo(0));
    }

    @Test
    public void testListAllAppointments_WithData() {
        // Create a test appointment first
        AppointmentEntity appointment = createSampleAppointment();
        given()
            .contentType(ContentType.JSON)
            .body(appointment)
            .post("/appointments");

        given()
            .when()
                .get("/appointments")
            .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("size()", greaterThan(0));
    }

    @Test
    public void testGetAppointmentById() {
        // First create an appointment
        AppointmentEntity appointment = createSampleAppointment();
        
        Long appointmentId = given()
            .contentType(ContentType.JSON)
            .body(appointment)
            .when()
                .post("/appointments")
            .then()
                .statusCode(201)
                .extract()
                .jsonPath()
                .getLong("id");

        // Then retrieve it by ID
        given()
            .when()
                .get("/appointments/" + appointmentId)
            .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("id", equalTo(appointmentId.intValue()))
                .body("patientFullName", equalTo(appointment.patientFullName))
                .body("patientEmail", equalTo(appointment.patientEmail))
                .body("patientPhoneNumber", equalTo(appointment.patientPhoneNumber))
                .body("reason", equalTo(appointment.reason));
    }

    @Test
    public void testCreateAppointment() {
        AppointmentEntity appointment = createSampleAppointment();

        given()
            .contentType(ContentType.JSON)
            .body(appointment)
            .when()
                .post("/appointments")
            .then()
                .statusCode(201)
                .contentType(ContentType.JSON)
                .body("id", notNullValue())
                .body("patientFullName", equalTo(appointment.patientFullName))
                .body("patientEmail", equalTo(appointment.patientEmail))
                .body("patientPhoneNumber", equalTo(appointment.patientPhoneNumber))
                .body("reason", equalTo(appointment.reason));
    }

    @Test
    public void testGetNonExistentAppointmentById() {
        given()
            .when()
                .get("/appointments/999999")
            .then()
                .statusCode(404);
    }

    @Test
    public void testCreateAppointment_MissingStartDateTime() {
        AppointmentEntity appointment = createSampleAppointment();
        appointment.startDateTime = null;

        given()
            .contentType(ContentType.JSON)
            .body(appointment)
            .when()
                .post("/appointments")
            .then()
                .statusCode(400);
    }

    @Test
    public void testCreateAppointment_MissingPatientName() {
        AppointmentEntity appointment = createSampleAppointment();
        appointment.patientFullName = null;

        given()
            .contentType(ContentType.JSON)
            .body(appointment)
            .when()
                .post("/appointments")
            .then()
                .statusCode(400);
    }

    @Test
    public void testCreateAppointment_InvalidEmail() {
        AppointmentEntity appointment = createSampleAppointment();
        appointment.patientEmail = "invalid-email";

        given()
            .contentType(ContentType.JSON)
            .body(appointment)
            .when()
                .post("/appointments")
            .then()
                .statusCode(400);
    }

    @Test
    public void testCreateAppointment_InvalidPhoneNumber() {
        AppointmentEntity appointment = createSampleAppointment();
        appointment.patientPhoneNumber = "123"; // Too short

        given()
            .contentType(ContentType.JSON)
            .body(appointment)
            .when()
                .post("/appointments")
            .then()
                .statusCode(400);
    }

    @Test
    public void testCreateAppointment_MissingReason() {
        AppointmentEntity appointment = createSampleAppointment();
        appointment.reason = null;

        given()
            .contentType(ContentType.JSON)
            .body(appointment)
            .when()
                .post("/appointments")
            .then()
                .statusCode(400);
    }

    @Test
    public void testCreateAppointment_MissingDuration() {
        AppointmentEntity appointment = createSampleAppointment();
        appointment.duration = null;

        given()
            .contentType(ContentType.JSON)
            .body(appointment)
            .when()
                .post("/appointments")
            .then()
                .statusCode(400);
    }

    @Test
    public void testDeleteAppointment() {
        // First create an appointment
        AppointmentEntity appointment = createSampleAppointment();
        
        Long appointmentId = given()
            .contentType(ContentType.JSON)
            .body(appointment)
            .when()
                .post("/appointments")
            .then()
                .statusCode(201)
                .extract()
                .jsonPath()
                .getLong("id");

        // Then delete it
        given()
            .when()
                .delete("/appointments/" + appointmentId)
            .then()
                .statusCode(204); // No Content

        // Verify it's deleted
        given()
            .when()
                .get("/appointments/" + appointmentId)
            .then()
                .statusCode(404); // Not Found
    }

    @Test
    public void testDeleteNonExistentAppointment() {
        given()
            .when()
                .delete("/appointments/999999")
            .then()
                .statusCode(404); // Not Found
    }
}
