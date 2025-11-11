---
post_title: Server Email Error Handling
author1: Project Management Team
post_slug: server-email-error-handling
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-server-errors.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- server
	- error-handling
ai_note: Document drafted with AI assistance
summary: Error handling patterns for Better Auth email endpoints on the server.
post_date: 2025-11-11
---

# Server Email Error Handling

Consistent error handling keeps APIs predictable and secure.

## Error Normalization

- Translate thrown exceptions into structured error objects with `code`, `message`, and `details`.
- Avoid leaking whether accounts exist during sign-up or password reset flows.

## Verification Enforcement

- Respond with `EmailNotVerified` when users attempt to sign in before completing verification and include resend eligibility details.

## Rate Limiting

- Return `TooManyRequests` with retry-after headers when verification or reset emails exceed configured thresholds.

## Token Failures

- Use distinct codes for expired versus invalid tokens to aid support tooling without leaking token contents.

## Logging and Telemetry

- Log errors with correlation IDs and minimal PII, emitting structured events for monitoring systems.
