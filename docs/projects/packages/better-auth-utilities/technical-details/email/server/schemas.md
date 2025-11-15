---
post_title: Server Email Schemas
author1: Project Management Team
post_slug: server-email-schemas
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-server-schemas.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- server
	- validation
ai_note: Document drafted with AI assistance
summary: Schema definitions applied on the server to validate Better Auth email requests and responses.
post_date: 2025-11-11
---

# Server Email Schemas

Server schemas enforce safety before requests reach business logic.

## Incoming Request Schemas

- Sign-up: `name`, `email`, `password`, optional `image`, optional `callbackURL` including sanitation and password policy validation.
- Sign-in: `email`, `password`, optional `rememberMe`, optional `callbackURL` with origin checks.
- Sign-out: session context extracted from cookies, no body allowed.
- Verification resend: `email`, optional `callbackURL`.
- Password reset request: `email`, optional `redirectTo`.
- Password reset completion: `token`, `newPassword`.
- Change password: `currentPassword`, `newPassword`, optional `revokeOtherSessions`.

## Response Schemas

- Success responses include normalized user and session payloads consistent with client expectations.
- Error responses carry `code`, `message`, and optional `metadata` (for example, `cooldownRemaining`).
