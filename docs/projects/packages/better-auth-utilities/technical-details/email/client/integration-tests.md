---
post_title: Client Email Integration Tests
author1: Project Management Team
post_slug: client-email-integration-tests
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-integration.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- client
	- testing
ai_note: Document drafted with AI assistance
summary: Integration testing strategy for client utilities interacting with Better Auth email endpoints.
post_date: 2025-11-11
---

# Client Email Integration Tests

Integration tests run client helpers against mocked server adapters to validate wiring and side effects.

## Sign-Up Integration

- Simulate full form submission, ensure validation occurs locally, and confirm the mocked server receives the correct payload.
- Verify verification prompts appear when the server responds with `emailNotVerified`.

## Sign-In Integration

- Assert session headers are persisted through the provided storage abstraction when `rememberMe` is true.
- Confirm error handling presents verification reminders and allows resend actions.

## Sign-Out Integration

- Ensure sign-out clears caches, cookies, and reactive stores.
- Validate redirect logic honors server-provided `callbackURL` overrides.

## Password Maintenance Integration

- Test `requestPasswordReset`, `resetPassword`, and `changePassword` flows to guarantee tokens and new passwords propagate correctly through the mocked server.
