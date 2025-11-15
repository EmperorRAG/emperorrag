---
post_title: Server Email Unit Tests
author1: Project Management Team
post_slug: server-email-unit-tests
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-server-unit-tests.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- server
	- testing
ai_note: Document drafted with AI assistance
summary: Unit testing expectations for server modules implementing Better Auth email functionality.
post_date: 2025-11-11
---

# Server Email Unit Tests

Unit tests cover pure logic and service branches without external dependencies.

## Validation and Sanitization

- Test email, password, and callback URL validation helpers with boundary cases.

## Token Management

- Ensure token creation calculates expiry correctly and consumption invalidates records.

## Service Logic

- Mock transports and token stores to verify `PasswordResetService` and `VerificationService` orchestrate dependencies correctly.
- Confirm `EmailAuthService` converts Better Auth errors into standardized error objects.

## Rate Limiting

- Validate the rate limiter decisions for resend and login attempts given various counters.
