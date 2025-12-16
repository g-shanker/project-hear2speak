<!--- Technical specification for the frontend application --->
# Hear2Speak — Frontend Technical Specification

This document describes the architecture, structure, and usage of the Hear2Speak frontend. It is intended as a concise technical reference for developers and tooling.

**Contents**
- Overview
- Quickstart / Dev
- Tech stack & key decisions
- Project layout
- Routing & pages
- Component categories
- Services (API & state)
- Interfaces (DTOs) used by the frontend
- Authentication flow
- Build, test, and lint
- Improvements & future work

---

## Overview

The frontend is an Angular application (currently using standalone components and Angular Signals in some services). It provides a public site for requesting appointments and an admin area for managing users and appointments. The app interacts with the backend API at `/api` via typed API services and uses a small client-side state layer (service signals) to hold selected appointment/search state.

## Quickstart / Dev

From the `frontend` directory:

```bash
# install
npm install

# run dev server (proxy configured to backend)
npm start
```

The project uses `proxy.conf.json` to forward calls to `/api` to the backend dev server.

## Tech stack & key decisions

- Framework: Angular (v16+). Uses standalone component approach in places and leverages Angular Signals for lightweight state.
- HTTP: `HttpClient` wrapped by small API service classes (e.g., `AppointmentApiService`, `AuthApiService`, `UserApiService`).
- Form handling: `ReactiveForms` for pages such as `login` and `create-appointment`.
- Routing: `app.routes.ts` contains route definitions, guarding admin pages with an auth guard.
- Authentication: JWT stored in localStorage (managed by `AuthService`); `AuthInterceptor` attaches token to outgoing requests.
- Testing: Jasmine/Karma unit tests present for several components.

## Project layout (selected)

Top-level `src/app` major directories:

- `admin-components` — admin-only pages (accounts, calendar-view, create-appointment, dashboards, find-appointment).
- `domain-components` — appointment domain UIs (forms, details, search, summary panels).
- `generic-components` — reusable UI pieces (carousel, search-bar, slicer, stat-card, summary-list).
- `guards` — route guards (e.g., `auth-guard.ts`).
- `interceptors` — HTTP interceptors (e.g., `auth-interceptor.ts`).
- `interfaces` — TypeScript interfaces matching backend DTOs (`appointment`, `auth`, `user`).
- `pages` — page components (login, admin, home).
- `services/api` — direct HTTP wrappers for backend endpoints.
- `services/component` — higher-level services that implement app state, caching, and orchestration between UI and API services.

Files of interest:
- `src/app/app.routes.ts` — top-level routes
- `src/app/pages/login` — login page
- `src/app/services/api` — API service implementations
- `src/app/services/component` — `AuthService`, `AppointmentService`, `UserService`

### Important files

- `src/app/app.config.ts` — application providers (HTTP client with `authInterceptor`, router, global error listeners, charts provider).
- `src/app/interceptors/auth-interceptor.ts` — attaches `Authorization: Bearer <token>` to outgoing HTTP requests if present.
- `src/app/guards/auth-guard.ts` — redirects unauthenticated users to `/login` and preserves `returnUrl`.
- `src/app/admin-components/calendar-view/calendar-utils.ts` — maps `AppointmentResponse` to FullCalendar `EventInput` objects.

## Routing & pages

Routes are defined in `app.routes.ts`. Key routes:

| Path | Component | Guard |
| --- | --- | --- |
| `/` | Home | - |
| `/login` | Login | - |
| `/admin` | Admin area (pages) | `auth-guard` (requires role) |

The `auth-guard` checks `AuthService` for an authenticated user and role information to allow or deny navigation to admin routes.

## Component categories

- Pages: top-level routes and forms (`Login`, `Admin` pages).
- Domain components: small, focused components that implement domain logic (Appointment form, search bar, details view).
- Generic components: UI-only components reusable across pages.

## Services (API & state)

Two-layer service pattern:

- API services (`services/api/*`) — thin `HttpClient` wrappers with typed method signatures for endpoints. Example classes: `AppointmentApiService`, `AuthApiService`, `UserApiService`.
- Component services (`services/component/*`) — stateful orchestrators that cache data, expose Observables or Signals, and coordinate calls to API services. Example: `AppointmentService` has signals for `searchResults`, `selectedAppointment`, and offers methods like `searchAppointments()`, `createAppointment()`, `updateAppointment()`.

### API services (key methods)

- `AppointmentApiService` (`src/app/services/api/appointment-api-service.ts`)
	- `createAppointment(appointment: CreateAppointmentRequest): Observable<AppointmentResponse>`
	- `updateAppointment(id: number, appointment: UpdateAppointmentRequest): Observable<AppointmentResponse>`
	- `deleteAppointment(id: number): Observable<void>`
	- `searchAppointments(request: AppointmentSearchRequest): Observable<AppointmentResponse[]>`

- `AuthApiService` (`src/app/services/api/auth-api-service.ts`)
	- `login(request: LoginRequest): Observable<TokenResponse>`

- `UserApiService` (`src/app/services/api/user-api-service.ts`)
	- `getCurrentUser(): Observable<UserResponse>`
	- `listUsers(): Observable<UserResponse[]>`
	- `createUser(request: RegisterRequest): Observable<void>`
	- `deleteUser(username: string): Observable<void>`
	- `forceResetPassword(username: string, request: ForceResetPasswordRequest): Observable<void>`

### Component services (patterns and behavior)

- `AuthService` (`src/app/services/component/auth-service.ts`)
	- Stores JWT in `localStorage` under `jwt_token`.
	- `login(request)` calls `AuthApiService.login()` and stores the token.
	- `getToken()` returns the stored JWT string.
	- `isAuthenticated()` decodes the token to check expiry and logs out expired tokens.
	- `tryAutoLogin()` invoked on construction to refresh current user if token present; calls `UserService.getCurrentUser()` and logs out on error.

- `AppointmentService` (`src/app/services/component/appointment-service.ts`)
	- Uses Angular Signals (`signal`) to hold `isLoading`, `errorMessage`, `searchResults`, `searchRequest`, `selectedAppointment`.
	- `searchAppointments(searchRequest)` performs the HTTP call and updates `searchResults` signal; errors are caught and `errorMessage` set.
	- `selectAppointment(appointment)` sets `selectedAppointment` and calls `acknowledgeAppointment()` for unacknowledged appointments.
	- `acknowledgeAppointment(appointment)` builds an `UpdateAppointmentRequest` payload and calls `updateAppointment()`.

Notes: Component services use `tap()` and `subscribe()` to update local signals and maintain UI state; prefer to keep side-effects in these services rather than spread through components.

Auth interaction:
- `AuthService` calls `AuthApiService.login()` to obtain a token, stores it in `localStorage`, exposes `isAuthenticated` state, and handles auto-login on startup.
- `AuthInterceptor` attaches `Authorization: Bearer <token>` to outgoing requests when present and handles HTTP 401 to trigger logout.

## Interfaces (DTOs)

Interfaces mirror the backend DTOs. Important interfaces under `src/app/interfaces` include:

| Interface | File | Notes |
| --- | --- | --- |
| `CreateAppointmentRequest` | `interfaces/appointment/create-appointment-request.ts` | Fields: `startDateTime`, `durationInSeconds`, `patientFullName`, `patientEmail`, `patientPhoneNumber`, `patientReason`, `clinicianNotes`, `isAcknowledged` |
| `UpdateAppointmentRequest` | `interfaces/appointment/update-appointment-request.ts` | Same fields with update semantics |
| `AppointmentResponse` | `interfaces/appointment/appointment-response.ts` | Response fields include `id`, `createdAt`, `updatedAt`, `appointmentStatus` |
| `AppointmentSearchRequest` | `interfaces/appointment/appointment-search-request.ts` | `globalText`, date ranges, `page`, `size`, `sortField`, `ascending` |
| `LoginRequest` | `interfaces/auth/login-request.ts` | `username`, `password` |
| `TokenResponse` | `interfaces/auth/token-response.ts` | `token` |
| `RegisterRequest`, `UserResponse` | `interfaces/user/*` | User management DTOs |

Notes: Dates are passed as ISO-8601 strings and are parsed/created by the front-end when building requests.

### Important interface details

- `CreateAppointmentRequest` & `UpdateAppointmentRequest` map directly to server-side DTOs. `startDateTime` should be an ISO-8601 `string` when serializing to JSON.
- `AppointmentResponse` fields `createdAt` and `updatedAt` are strings in ISO-8601 format; UI code commonly uses `date-fns` `parseISO()` or `format()` before rendering or for calendar conversion.

Example usage (create appointment):

```ts
const payload: CreateAppointmentRequest = {
	startDateTime: '2025-12-30T14:30:00',
	durationInSeconds: 1800,
	patientFullName: 'Alice',
	patientEmail: 'alice@example.test',
	patientPhoneNumber: '0123456789',
	patientReason: 'Checkup'
};
appointmentService.createAppointment(payload).subscribe();
```

## Authentication flow
### Token handling & interceptor registration

- Tokens are stored in `localStorage` under `jwt_token` by `AuthService`.
- The `authInterceptor` is registered in `app.config.ts` via `provideHttpClient(withInterceptors([authInterceptor]))`, ensuring all outgoing requests use the token when present.

Security note: The code decodes JWT payload in-browser to check expiry (`AuthService.isTokenExpired()`). This is a convenience but should not be relied on for security-critical checks — server-side checks must be authoritative.

1. User submits login form on `/login`.
2. `AuthService.login()` calls `AuthApiService.login()` → receives `TokenResponse.token`.
3. `AuthService` stores token in `localStorage` and updates current user state; `AuthInterceptor` includes token on subsequent requests.
4. Auth state is used to show/hide admin UI and guard routes.

Security notes: Token lifetime is short (configurable on the backend). There is no refresh token implementation in the frontend; when token expires, `AuthInterceptor` responds to 401 by redirecting to `/login`.

## Build, test, and lint

- Install: `npm install`
- Dev server: `npm start` (runs `ng serve` / `vite` depending on config; proxy forwards `/api` to backend)
- Tests: `npm test` (Karma/Jasmine)
- Linting: `npm run lint` (if configured)

### Testing notes

- Unit tests exist for most components under `src/app/**/*.spec.ts`. Run `npm test` to run all tests.
- To add tests for services, use Angular TestBed or Jest (if migrating). Mocks for `HttpClient` requests are commonly done with `HttpTestingController`.

Example (service test outline):

```ts
describe('AppointmentService', () => {
	beforeEach(() => TestBed.configureTestingModule({ providers: [HttpClientTestingModule, AppointmentService] }));

	it('updates searchResults after search', () => {
		// arrange/act/assert using HttpTestingController
	});
});
```

## Improvements & Future work

- Add a typed OpenAPI-client generator to derive API interfaces and clients from the backend spec (eliminate duplication).
- Implement refresh tokens and automatic token refresh to avoid forcing users to re-login on short JWT expiry.
- Add centralized error handling UI and user-friendly toasts for API errors.
- Add stronger typing for dates (e.g., use dayjs/ISO utilities) and explicit timezone handling.
- Add E2E tests (Cypress) for smoke tests across core flows.

Additional frontend-specific improvements

- Use an OpenAPI-to-Typescript generator to keep interfaces and API clients in sync with the backend; consider `openapi-typescript` or `openapi-generator`.
- Centralize API error parsing and map `ApiError` from backend to user-friendly messages (e.g., map validation errors to form messages).
- Introduce caching and optimistic updates in `AppointmentService` for snappier UI (use small delta patches with rollback on error).
- Add UI-level feature flags and environment-specific configs (e.g., to toggle dev-only features like admin seeding info).
- Improve accessibility across components and add automated accessibility checks (axe-core integration).

---

Document last updated: 2025-12-15

---

Document last updated: 2025-12-15
