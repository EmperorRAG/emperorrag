---
post_title: Client Email API Schema Tests
author1: Project Management Team
post_slug: client-email-api-schema-tests
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-client-tests.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- client
	- testing
ai_note: Document drafted with AI assistance
summary: Test scenarios that validate the client request and response schemas for Better Auth email flows.
post_date: 2025-11-11
---

# Client Email API Schema Tests

These tests ensure the client adapters invoke the Better Auth email endpoints
with the correct payload structure and gracefully parse responses.

## Sign-Up Email Schema

- Confirm required fields include `name`, `email`, and `password` with optional `image` and `callbackURL`.
- Verify password length constraints (default 8-128 characters) are enforced in the schema prior to submission.
- Assert optional fields are omitted when undefined to prevent sending empty strings.

## Sign-In Email Schema

- Validate that `rememberMe` and `callbackURL` are optional and default to safe values when not provided.
- Ensure the schema maps client level errors to user-friendly messages when the server responds with verification or credential failures.

## Sign-Out Schema

- Confirm the sign-out request sends an empty body by default while allowing optional `fetchOptions` to be appended through schema-approved properties.

## Verification and Reset Schemas

- Ensure `sendVerificationEmail` payload demands `email` plus optional `callbackURL`.
- Validate password reset and change password schemas enforce password policies before the request is dispatched.
