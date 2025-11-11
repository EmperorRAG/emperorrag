---
post_title: Server Email Types
author1: Project Management Team
post_slug: server-email-types
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-server-types.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- server
	- typing
ai_note: Document drafted with AI assistance
summary: Core type definitions backing server-side Better Auth email flows.
post_date: 2025-11-11
---

# Server Email Types

Typed contracts keep server modules aligned with client expectations and database models.

## Inputs

- `SignUpEmailServerInput` includes sanitized strings plus request context (IP, user agent).
- `SignInEmailServerInput` includes credentials and remember-me preference.
- `VerificationEmailServerInput` and `PasswordResetRequestServerInput` capture email plus optional callback or redirect.
- `ResetPasswordServerInput` includes token, new password, and optional metadata for analytics.
- `ChangePasswordServerInput` includes current and new passwords plus session context.

## Results

- `SignUpEmailServerResult` returns user, session, verification requirements, and callback URL.
- `SignInEmailServerResult` returns session, user, and verification requirement flags.

## Supporting Types

- `SessionContext` describing current session identifiers and cookie attributes.
- `TokenRecord` capturing token value, type, expiration, and metadata.
- `EmailServiceError` union referencing `EmailAuthErrorCode` values with supporting details.
