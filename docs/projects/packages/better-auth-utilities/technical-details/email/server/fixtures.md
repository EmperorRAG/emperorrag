---
post_title: Server Email Fixtures
author1: Project Management Team
post_slug: server-email-fixtures
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-server-fixtures.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- server
	- testing
ai_note: Document drafted with AI assistance
summary: Standard server-side fixtures supporting Better Auth email testing scenarios.
post_date: 2025-11-11
---

# Server Email Fixtures

Fixtures seed databases and mocks for deterministic server testing.

## Users and Accounts

- `verifiedAccount` with hashed password and verification timestamp.
- `unverifiedAccount` lacking verification timestamp to trigger enforcement.
- `passwordResetPendingAccount` linked to an active reset token.

## Tokens

- Verification token records with expiry metadata.
- Password reset token records representing valid and expired cases.

## Requests

- HTTP payloads for sign-up, sign-in, sign-out, verification resend, reset request, reset completion, and change password.

## Responses

- Expected JSON responses for success and error cases to validate serialization.
