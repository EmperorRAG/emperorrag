---
pageGoal: Create a proof-of-concept admin page to display user data in a datagrid.
pagePath: apps/better-auth-next-js-frontend/src/app/admin/page.tsx
frontendProject: better-auth-next-js-frontend
backendProject: better-auth-nest-js-microservice
integrationName: better-auth-nest-js-microservice API
sharedComponent: Datagrid
targetAudience: Admin
constraints: Must use imperative/declarative programming, not Effect-TS. Focus only on displaying user data.
---

# Implementation Plan: Better Auth Admin User Dashboard

This document outlines the implementation plan for creating a proof-of-concept (POC) admin dashboard page. The primary goal of this page is to fetch and display user data from the `better-auth-nest-js-microservice` in a tabular format using the shared `Datagrid` component.

This plan adheres to the repository's Next.js and React development guidelines, emphasizing an imperative/declarative programming model as requested for this Next.js implementation.

## 1. Backend Responsibilities

The `better-auth-nest-js-microservice` already exposes the required Better Auth endpoints via the `@thallesp/nestjs-better-auth` integration, which maps the Better Auth package and its plugins into NestJS route handlers.

- **Existing Endpoint**: `GET /api/users` is available out of the box and returns the Better Auth user collection managed by the microservice.
  - **Description**: Retrieves a list of all users maintained by Better Auth.
  - **Response**: JSON array of Better Auth user objects matching the shared `User` interface.
- **Next Steps**: No additional backend development is needed for this POC beyond confirming the service is reachable from the frontend environment.

## 2. Shared Contracts

To ensure type safety and consistency between the frontend and backend, reuse the existing `User` interface defined in `packages/better-auth-utilities/src/lib/core/users/users.utils.ts`.

- **Contract Definition**: The shared `User` interface already models the Better Auth user entity (fields include identifiers, profile details, verification flags, bans, and timestamps). Re-export this interface through the package's public API so both the Next.js frontend and NestJS microservice can import it without duplicating types.
- **Action**: Add a targeted export in `packages/better-auth-utilities/src/index.ts` (or a dedicated barrel) to expose the `User` interface for consumption by feature code and external projects as needed.

## 3. Data Layer (Frontend)

The frontend data layer is responsible for fetching user data from the backend API.

- **Technology**: The standard `fetch` API will be used for making the HTTP request. Data fetching logic will be encapsulated within the page component, leveraging React Server Components (RSC) for a server-side fetch.
- **Implementation**:
  - A `fetchUsers` function will be created to call the `GET /api/users` endpoint.
  - This function will be called directly within the `AdminPage` Server Component.
  - The function will handle the request, parse the JSON response, and return the array of `User` objects.
  - Basic error handling (e.g., logging failed requests) will be included.

## 4. UI Layer

The UI layer will render the fetched user data using the existing shared `Datagrid` component.

- **Page Component**:
  - **Location**: `apps/better-auth-next-js-frontend/src/app/admin/page.tsx`
  - **Type**: This will be a React Server Component (RSC) by default to handle server-side data fetching.
- **Component Usage**:
  - The `Datagrid` component, located at `packages/components/src/lib/datagrid/datagrid.tsx`, will be imported and used.
  - The fetched user data will be passed to the `Datagrid` component's props.
  - Column definitions for the datagrid will be configured to display relevant user fields (e.g., ID, Email, Name, Status, Created At).
- **Styling**: The page will use CSS Modules (`page.module.css`) for styling, consistent with the existing structure.

## 5. Workflows

- **User Visit**: An admin user navigates to the `/admin` route.
- **Data Fetching**: The `AdminPage` Server Component executes on the server, calling the `fetchUsers` function.
- **API Call**: An API request is made to the `better-auth-nest-js-microservice` at `GET /api/users`.
- **Data Rendering**: The microservice returns the user data. The `AdminPage` component renders the `Datagrid` with this data.
- **Display**: The fully rendered HTML, including the user data, is sent to the client's browser.

## 6. Access Control

While full authentication and authorization are outside the scope of this POC, the page should be considered a protected route.

- **Requirement**: Access to the `/admin` page should be restricted to authenticated users with an 'Admin' role.
- **Implementation Note**: The mechanism for enforcing this (e.g., Next.js Middleware, Higher-Order Component) will be detailed in a separate implementation plan for authentication. For this POC, we will proceed as if the user is already authenticated.

## 7. Testing

- **Unit/Integration Tests**:
  - A test file `apps/better-auth-next-js-frontend/src/app/admin/page.test.tsx` will be created.
  - Tests will use React Testing Library to verify that the `Datagrid` component renders correctly with mock user data.
  - The API fetch call will be mocked using `msw` or a similar library to test the data fetching and rendering logic without making real network requests.
- **E2E Tests**: No new E2E tests are planned for this specific POC, but this functionality should be included in future E2E test suites for the admin section.

## 8. Readiness Checklist

- [ ] Confirm `GET /api/users` endpoint exists and is functional in `better-auth-nest-js-microservice`.
- [ ] Create shared `User` type in `packages/utilities`.
- [ ] Implement server-side data fetching logic in `admin/page.tsx`.
- [ ] Integrate the `Datagrid` component to display the fetched user data.
- [ ] Add unit tests for the `AdminPage` component.
- [ ] Code review and approval.
