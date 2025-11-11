---
post_title: Server Email Enums
author1: Project Management Team
post_slug: server-email-enums
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-server-enums.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- server
	- typing
ai_note: Document drafted with AI assistance
summary: Enumeration values that underpin server-side Better Auth email workflows.
post_date: 2025-11-11
---

# Server Email Enums

Enumerations standardize state and error codes for logging, telemetry, and client interop.

## EmailAuthAuditEvent

- `SignUp`, `SignIn`, `SignOut`, `VerificationSent`, `PasswordResetRequested`, `PasswordResetCompleted`, `PasswordChanged`.

## EmailAuthErrorCode

- `InvalidCredentials`, `EmailNotVerified`, `PasswordTooWeak`, `ResetTokenExpired`, `ResetTokenInvalid`, `TooManyRequests`, `InternalError`.

## EmailTokenType

- `Verification`, `PasswordReset` for disambiguating token storage and expiration.
