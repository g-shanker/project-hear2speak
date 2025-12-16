<!--- Generated comprehensive backend documentation for use by developers and AI agents --->
# Hear2Speak — Backend Documentation

This document explains the design, architecture, and usage of the backend for the Hear2Speak booking management system. It is intended to be comprehensive so other developers or AI agents can understand how the backend works, why decisions were made, and where to look to make changes.

**Contents**
- Overview
- Quickstart
- Tech stack & Design Decisions
- Project structure and packages
- API Reference (endpoints, DTOs, validations)
- Authentication & Authorization
- Persistence & Data Model
- Services, Repositories & Mappers
- Error handling & Validation
- Configuration
- Tests & Dev tooling
- How to onboard an AI agent
- Improvements & Future features

---

## Overview

The backend is a Java microservice built with Quarkus. It exposes a small REST API used by the frontend (and other clients) to manage users and appointments. Business logic is implemented in service classes; persistence uses JPA entities and Quarkus Panache repositories. Authentication uses JWTs issued on successful login.

Core responsibilities:
- Manage appointments (create, update, delete, search)
- Manage users (register, list, get current user, password management)
- Authenticate users (issue JWT tokens)

The service is intentionally small and opinionated, making it easy for an AI agent to reason about expected behavior and make or propose changes safely.

## Quickstart

From the `backend` directory:

1. Run in dev mode (hot reload):

```bash
./mvnw quarkus:dev
```

2. Run tests:

```bash
./mvnw test
```

3. Package:

```bash
./mvnw package
```

4. Build native executable (optional):

```bash
./mvnw package -Dnative
```

Dev defaults use an in-memory H2 database and an optional seeded admin user (configurable, see Configuration section).

## Tech Stack & Design Decisions

- Framework: Quarkus — chosen for fast startup, small memory footprint, and developer friendliness (hot reload / dev UI).
- Persistence: Hibernate ORM with Panache — reduces boilerplate repository code and provides convenient query handling.
- Auth: SmallRye JWT + Quarkus security annotations — simple stateless JWT-based auth that integrates with Quarkus HTTP security.
- Passwords: Bcrypt for hashing via `io.quarkus.elytron.security.common.BcryptUtil`.
- DTOs + Mappers: DTOs decouple transport format from internal entities. Mappers centralize transformation, making validation and responses consistent.
- Exception handling: Single `GlobalExceptionMapper` to convert exceptions into `ApiError` payloads for consistent API error responses.

Why these choices:
- Keep the backend lightweight and easy to run in dev and CI.
- Panache simplifies common DB operations while keeping explicit transactional boundaries in services.
- JWT statelessness makes it easy to scale horizontally without server-side session management.

## Project Structure

Top-level packages (under `src/main/java/com/hear2speak`):

- `controllers` — JAX-RS resource classes (endpoint definitions). E.g., `AppointmentController`, `UserController`, `AuthController`.
- `dtos` — Request/response classes used at the API boundary.
- `entities` — JPA entities (appointment and user models).
- `repositories` — Panache repositories providing DB access logic.
- `services` — Business logic; transactional boundaries and core application behavior.
- `mappers` — Convert between DTOs and entities.
- `exceptions` — API error and global exception mapper.
- `auth` — Auth-related bootstrapping (initial admin seeder).

Files of interest:
- [AppointmentController](src/main/java/com/hear2speak/controllers/AppointmentController.java)
- [AppointmentService](src/main/java/com/hear2speak/services/AppointmentService.java)
- [AppointmentEntity](src/main/java/com/hear2speak/entities/appointment/AppointmentEntity.java)
- [AppointmentRepository](src/main/java/com/hear2speak/repositories/AppointmentRepository.java)
- [AppointmentMapper](src/main/java/com/hear2speak/mappers/AppointmentMapper.java)
- [UserController](src/main/java/com/hear2speak/controllers/UserController.java)
- [UserService](src/main/java/com/hear2speak/services/UserService.java)
- [AuthController](src/main/java/com/hear2speak/controllers/AuthController.java)

## Detailed API Reference

Base path: `/api` (configured in `application.properties`). All endpoints produce and consume `application/json` unless stated otherwise.

Notes about date/time: fields using `LocalDateTime` (e.g., `startDateTime`) expect ISO-8601 format (example: `2025-12-30T14:30:00`). The server stores and handles times as Java `LocalDateTime` (no timezone information in stored value) — consider sending UTC or agreed client-server local times.

### Endpoints summary

| Method | Path | Auth | Request | Response | Notes |
| --- | --- | --- | --- | --- | --- |
| POST | `/api/appointments` | Permit | `CreateAppointmentRequest` | `AppointmentResponse` (201) | Anonymous allowed; server applies defaults for some fields |
| PUT | `/api/appointments/{id}` | Authenticated | `UpdateAppointmentRequest` | `AppointmentResponse` (200) | Update existing appointment |
| DELETE | `/api/appointments/{id}` | Authenticated | - | 200 / 404 | Delete by id |
| POST | `/api/appointments/search` | Authenticated | `AppointmentSearchRequest` | Array[`AppointmentResponse`] (200) | Filtering, sorting, pagination |
| GET | `/api/users/me` | Authenticated | - | `UserResponse` (200) | Current user info |
| PUT | `/api/users/me/reset-password` | Authenticated | `ChangePasswordRequest` | 200 | Change own password |
| GET | `/api/users` | RolesAllowed(ADMIN) | - | Array[`UserResponse`] (200) | List users |
| POST | `/api/users` | RolesAllowed(ADMIN) | `RegisterRequest` | 201 | Create user (admin) |
| DELETE | `/api/users/{username}` | RolesAllowed(ADMIN) | - | 200 / 404 | Delete user |
| PUT | `/api/users/{username}/reset-password` | RolesAllowed(ADMIN) | `ForceResetPasswordRequest` | 200 | Force reset (admin) |
| POST | `/api/auth/login` | Public | `LoginRequest` | `TokenResponse` (200) | Returns JWT |

-----

### Appointments (detailed)

#### POST `/api/appointments`
- Purpose: Create a new appointment.
- Auth: Permit (anonymous allowed).
- Request body: `CreateAppointmentRequest` (see DTO Reference below).
- Success response: 201 Created with `AppointmentResponse` body.
- Error responses: 400 Bad Request for validation errors; 500 for unexpected errors.

Example request:

```json
{
  "startDateTime": "2025-12-30T14:30:00",
  "durationInSeconds": 1800,
  "patientFullName": "Alice Example",
  "patientEmail": "alice@example.test",
  "patientPhoneNumber": "0123456789",
  "patientReason": "Initial consultation"
}
```

Example response (201):

```json
{
  "id": 1,
  "startDateTime": "2025-12-30T14:30:00",
  "durationInSeconds": 1800,
  "appointmentStatus": "REQUESTED",
  "patientFullName": "Alice Example",
  "patientEmail": "alice@example.test",
  "patientPhoneNumber": "0123456789",
  "patientReason": "Initial consultation",
  "isAcknowledged": false,
  "createdAt": "2025-12-15T10:00:00",
  "updatedAt": "2025-12-15T10:00:00"
}
```

#### PUT `/api/appointments/{id}`
- Purpose: Update an existing appointment.
- Auth: `@Authenticated` (JWT required).
- Request body: `UpdateAppointmentRequest`.
- Success response: 200 OK with `AppointmentResponse`.
- Error responses: 400 Bad Request for validation errors; 404 Not Found when the appointment id does not exist; 401 Unauthorized when missing/invalid token.

#### DELETE `/api/appointments/{id}`
- Purpose: Delete appointment by id.
- Auth: `@Authenticated`.
- Success response: 200 OK with empty body.
- Error responses: 404 Not Found if id not present.

#### POST `/api/appointments/search`
- Purpose: Search appointments with multiple optional filters and support sorting and pagination.
- Auth: `@Authenticated`.
- Request body: `AppointmentSearchRequest`.
- Behavior:
  - `globalText`: performs case-insensitive LIKE search across patientFullName, patientEmail, patientPhoneNumber, patientReason and clinicianNotes.
  - `startDateFrom` / `startDateTo`: inclusive date range filters against `startDateTime`.
  - `appointmentStatus`: exact match filter.
  - Sorting: use `sortField` (must be one of configured allowed fields) and `ascending` boolean; defaults come from configuration.
  - Pagination: `page` (0-based) and `size` (defaults provided in DTO).
- Success response: 200 OK with array of `AppointmentResponse` objects (considered for pagination metadata enhancements in future).


## Authentication & Authorization

- Login issues a JWT signed by `smallrye.jwt.sign` configuration and valid for the configured `app.constants.users.jwt-lifetime` (default 300s).
- `UserService` uses `BcryptUtil` for password hashing and `Jwt` builder for token creation.
- Endpoint protection uses Quarkus HTTP auth permissions and JAX-RS method annotations:
  - `@Authenticated` — ensures a valid JWT is present.
  - `@RolesAllowed("ADMIN")` — restricts to admin users.
- `SecurityIdentity` is injected into services (e.g., `AppointmentService`) to inspect the current user and determine behavior (e.g., default appointment status for anonymous vs authenticated users).

Seeded admin user
- `AuthSeeder` will create an initial `admin` user when `app.admin.seeding-enabled` is `true` (helpful for local development).

## Persistence & Data Model

- Database: H2 in-memory by default (config in `application.properties`), with `quarkus.hibernate-orm.database.generation=drop-and-create` in dev.
- Entities:
  - `AppointmentEntity` — appointment fields, patient info, clinician notes, status, audit fields (`createdAt`, `updatedAt`) and lifecycle callbacks (via `@PrePersist` and `@PreUpdate`).
  - `UserEntity` — username, hashed password, role.
- Repositories use Panache (`PanacheRepository<T>`) to keep code concise and expressive.

Search implementation
- `AppointmentService.searchAppointments()` builds dynamic JPQL-like queries using provided filter fields and parameters, supports global text search on multiple columns, date range filters, status filter, sorting and pagination.

## Services, Repositories & Mappers

- Services contain transactional boundaries and orchestrate repository access and mapping to/from DTOs.
- Example responsibilities in `AppointmentService`:
  - Validate/normalize request objects.
  - Apply business defaults (duration, appointment status depending on authentication state).
  - Build dynamic queries for searching.
- Mappers convert between DTOs and Entities to ensure the API layer never leaks persistence-specific details and to centralize mapping logic.

## Error handling & Validation

- All unhandled exceptions flow through `GlobalExceptionMapper`, which converts exceptions into a consistent `ApiError` JSON payload with `status`, `error`, `message`, `path`, and `timestamp`.
- Services throw `WebApplicationException` to indicate specific HTTP status codes (e.g., 404 Not Found, 400 Bad Request, 401 Unauthorized).
- Bean validation issues surface as constraint violations and are reported by the framework.

## Configuration

Key config properties (see `application.properties`):

- `quarkus.http.root-path` — base path for the API (default `/api`).
- `quarkus.datasource.*` — DB connection (H2 used in dev by default).
- JWT config: `mp.jwt.verify.issuer`, `smallrye.jwt.sign.key.location`, `mp.jwt.verify.publickey.location`.
- Appointment constants:
  - `app.constants.appointments.default-duration-in-seconds`
  - `app.constants.appointments.default-patient-logged-appointment-status`
  - `app.constants.appointments.default-clinician-logged-appointment-status`
  - `app.constants.appointments.allowed-sort-fields`
  - `app.constants.appointments.default-sort-field`

- User constants: `app.constants.users.jwt-lifetime`
- Admin seeding: `app.admin.seeding-enabled`, `app.admin.initial-password` (dev only)

Configuration is injected into services using `@ConfigProperty` so behavior is environment-configurable.

## Tests & Dev tooling

- There are unit/integration tests (e.g., `AppointmentControllerTest`), run with `./mvnw test`.
- Quarkus dev mode (`quarkus:dev`) provides hot reload and a Dev UI (`/q/dev/`) for quick diagnostics.

## Data Model

This section documents the persistent entities and the important constraints and behavior.

### AppointmentEntity

| Field | Type | DB column | Notes |
| --- | --- | --- | --- |
| `id` | Long | `id` (PK) | Generated primary key |
| `startDateTime` | LocalDateTime | `start_date_time` | Required by DTOs; ISO-8601 strings expected in JSON |
| `durationInSeconds` | Integer | `duration_in_seconds` | Defaulted server-side if missing (`app.constants.appointments.default-duration-in-seconds`) |
| `appointmentStatus` | `AppointmentStatus` (enum) | `appointment_status` | Stored as STRING; default varies by caller auth state |
| `patientFullName` | String | `patient_full_name` | Patient name |
| `patientEmail` | String | `patient_email` | Patient email (validated in DTOs) |
| `patientPhoneNumber` | String | `patient_phone_number` | Pattern: 10 digits enforced in DTOs |
| `patientReason` | String | `patient_reason` | Up to 1000 chars |
| `clinicianNotes` | String | `clinician_notes` | Up to 1000 chars; cleared for anonymous creation |
| `isAcknowledged` | Boolean | `is_acknowledged` | Default `false` |
| `createdAt` | LocalDateTime | `created_at` | Audit timestamp, set in `@PrePersist` |
| `updatedAt` | LocalDateTime | `updated_at` | Audit timestamp, updated in `@PreUpdate` |

Notes: Business defaults (duration and appointmentStatus) are applied in `AppointmentService.applyDefaults()` and depend on whether the request comes from an anonymous caller or an authenticated user.

### UserEntity

| Field | Type | DB column | Notes |
| --- | --- | --- | --- |
| `id` | Long | `id` (PK) | Generated primary key |
| `username` | String | `username` | Unique, not null |
| `password` | String | `password` | Bcrypt-hashed password |
| `role` | `UserRole` (enum) | `role` | Stored as STRING, required |

Notes: Passwords are hashed with Bcrypt using `BcryptUtil`. Admin seeding uses `AuthSeeder` (dev-only) to create an initial admin account when enabled in configuration.

## DTO Reference

Detailed list of DTOs used by the API and their validation/behavioral notes.


### Appointment DTOs

Create a brief table for each DTO to make fields, types, and validations easy to scan.

#### CreateAppointmentRequest

| Field | Type | Validation | Notes |
| --- | --- | --- | --- |
| `startDateTime` | `LocalDateTime` | `@NotNull` | ISO-8601 string expected |
| `durationInSeconds` | `Integer` | optional | Defaults server-side if missing |
| `appointmentStatus` | `AppointmentStatus` | optional | May be overridden for anonymous creators |
| `patientFullName` | `String` | `@NotBlank` |  |
| `patientEmail` | `String` | `@NotBlank`, `@Email` |  |
| `patientPhoneNumber` | `String` | `@NotBlank`, `@Pattern("\\d{10}")` | Exactly 10 digits |
| `patientReason` | `String` | `@NotBlank`, `@Size(min=3, max=1000)` |  |
| `clinicianNotes` | `String` | `@Size(max=1000)` | Cleared for anonymous creations |
| `isAcknowledged` | `Boolean` | optional |  |

Behavior: When created by anonymous users, certain fields (status, clinicianNotes, isAcknowledged) are set to safe defaults by the service layer.

#### UpdateAppointmentRequest

| Field | Type | Validation | Notes |
| --- | --- | --- | --- |
| `startDateTime` | `LocalDateTime` | `@NotNull` | Required for updates in this API design |
| `durationInSeconds` | `Integer` | optional |  |
| `appointmentStatus` | `AppointmentStatus` | optional | Authenticated users can set status |
| `patientFullName` | `String` | `@NotBlank`, `@Size(min=2)` |  |
| `patientEmail` | `String` | `@NotBlank`, `@Email` |  |
| `patientPhoneNumber` | `String` | `@NotBlank`, `@Pattern("\\d{10}")` |  |
| `patientReason` | `String` | `@NotNull`, `@Size(min=3, max=1000)` |  |
| `clinicianNotes` | `String` | `@Size(max=1000)` |  |
| `isAcknowledged` | `Boolean` | optional |  |

Mapping: `AppointmentMapper.updateEntity()` merges non-null update fields into the entity and `AppointmentService` sets `updatedAt`.

#### AppointmentResponse

| Field | Type | Notes |
| --- | --- | --- |
| `id` | Long |  |
| `startDateTime` | String (ISO-8601) | `LocalDateTime` converted to string for clients |
| `durationInSeconds` | Integer |  |
| `appointmentStatus` | `AppointmentStatus` |  |
| `patientFullName` | String |  |
| `patientEmail` | String |  |
| `patientPhoneNumber` | String |  |
| `patientReason` | String |  |
| `clinicianNotes` | String |  |
| `isAcknowledged` | Boolean |  |
| `createdAt` | String (ISO-8601) | Audit timestamp |
| `updatedAt` | String (ISO-8601) | Audit timestamp |

#### AppointmentSearchRequest

| Field | Type | Validation/Default | Notes |
| --- | --- | --- | --- |
| `sortField` | String | Must be in allowed list | See config `app.constants.appointments.allowed-sort-fields` |
| `ascending` | Boolean | Optional (config default) | true = ascending |
| `globalText` | String | Optional | Case-insensitive LIKE across patient/clinician fields |
| `startDateFrom` | `LocalDateTime` | Optional | Inclusive |
| `startDateTo` | `LocalDateTime` | Optional | Inclusive |
| `appointmentStatus` | `AppointmentStatus` | Optional |  |
| `page` | Integer | default = 0 | 0-based page |
| `size` | Integer | default = 20 | Page size |

### User DTOs

#### RegisterRequest

| Field | Type | Validation | Notes |
| --- | --- | --- | --- |
| `username` | String | required | Unique |
| `password` | String | required | Will be hashed (Bcrypt) |
| `role` | `UserRole` | required | e.g., `ADMIN`, `USER` |

#### UserResponse

| Field | Type | Notes |
| --- | --- | --- |
| `id` | Long |  |
| `username` | String |  |
| `role` | `UserRole` |  |

#### ChangePasswordRequest

| Field | Type | Validation | Notes |
| --- | --- | --- | --- |
| `oldPassword` | String | required |  |
| `newPassword` | String | required |  |

#### ForceResetPasswordRequest

| Field | Type | Validation | Notes |
| --- | --- | --- | --- |
| `newPassword` | String | required | Admin-only endpoint |

### Auth DTOs

#### LoginRequest

| Field | Type | Validation | Notes |
| --- | --- | --- | --- |
| `username` | String | `@NotBlank` |  |
| `password` | String | `@NotBlank` |  |

#### TokenResponse

| Field | Type | Notes |
| --- | --- | --- |
| `token` | String | JWT (Compact serialized string) |

Note on mapping: `AppointmentMapper` and `UserMapper` centralize transformations; `toResponse()` typically converts `LocalDateTime` to ISO-8601 `String` for client readability.

## Improvements & Future ideas

Below are short-term and long-term improvements and feature ideas that could be implemented to increase robustness, user experience, and maintainability.

Short-term / quality-of-life
- Add OpenAPI / Swagger documentation (auto-generate API spec and UI).
- Add pagination metadata (total count, page, size) to search responses.
- Improve search: support field-specific filters, exact matching, fuzzy matching, and an index for better performance (e.g., full-text index or using a search engine).
- Return more descriptive error payloads for validation failures (map validation errors into `ApiError` details).
- Add more comprehensive unit & integration tests and include error/edge-case tests.
- Improve timezone handling and store timestamps in UTC; ensure clients and server agree on formats.

Medium-term
- Switch from H2 to a production-grade DB (PostgreSQL) and introduce migrations with Flyway or Liquibase.
- Add asynchronous notifications (email or SMS) for appointment events.
- Add conflict detection and availability checks to prevent double-booking.
- Add rate limiting, request throttling, and better input sanitization to mitigate abuse.
- Add pagination and filtering helpers to standardize paging across APIs.

Long-term / new features
- Support recurring appointments and availability rules (recurrence patterns, cancellations).
- Add calendar integration (Google Calendar, Outlook) and webhooks for external systems to receive appointment events.
- Add advanced RBAC and scopes (more granular permissions than `ADMIN` role) and an admin UI for role management.
- Add observability: metrics (Prometheus), tracing (Jaeger), and structured logs.
- Implement refresh tokens, token revocation, and more secure key management (secrets store / KMS).

## Final notes

The backend codebase is intentionally small and straightforward. Most changes follow the pattern of adding a DTO, controller endpoint, service logic, a mapper if needed, and tests. Use `PanacheRepository` or Panache queries for persistence, use `@Transactional` in service methods that mutate data, and prefer configuration-driven behavior for environment differences.

If you'd like, I can also:
- Add OpenAPI annotations and generate API docs.
- Add example curl commands and Postman collection.
- Add CI job and database migration setup.

---

Document last updated: 2025-12-15
