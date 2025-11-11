---
post_title: Client Email Fixtures
author1: Project Management Team
post_slug: client-email-fixtures
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-fixtures.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- client
	- testing
ai_note: Document drafted with AI assistance
summary: Canonical data fixtures used across client tests for Better Auth email functionality.
post_date: 2025-11-11
---

# Client Email Fixtures

Fixtures provide deterministic data for tests and story-driven previews.

## User Profiles

- `verifiedUser` with matching email and password data.
- `unverifiedUser` flagged to trigger verification flows.
- `passwordResetPendingUser` representing users mid-reset.

## Requests

- `signUpRequest` with sample name, email, password, and optional image.
- `signInRequest` variations toggling `rememberMe` and `callbackURL`.
- `resetPasswordRequest` containing email and redirect parameters.

## Responses

- Success payloads for sign-up, sign-in, and sign-out, including expected session tokens.
- Error payloads for invalid credentials, email not verified, and expired tokens.

## Tokens and Links

- Sample verification link template referencing `callbackURL`.
- Password reset token and URL pair for e2e simulations.
