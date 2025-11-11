---
post_title: Client Email Types
author1: Project Management Team
post_slug: client-email-types
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-types.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- client
	- typing
ai_note: Document drafted with AI assistance
summary: Type definitions required for client implementations of Better Auth email features.
post_date: 2025-11-11
---

# Client Email Types

Type definitions ensure compile-time safety across the email feature surface.

## Inputs

- `SignUpEmailInput` with `name`, `email`, `password`, optional `image`, optional `callbackURL`.
- `SignInEmailInput` with `email`, `password`, optional `rememberMe`, optional `callbackURL`.
- `VerificationEmailInput` with `email`, optional `callbackURL`.
- `PasswordResetRequestInput` with `email`, optional `redirectTo`.
- `ResetPasswordInput` with `token`, `newPassword`.
- `ChangePasswordInput` with `currentPassword`, `newPassword`, optional `revokeOtherSessions`.

## Results

- `SignUpEmailResult` bundling `user`, `session`, and optional `callbackURL`.
- `SignInEmailResult` returning `session`, `user`, and `requiresVerification` flag.

## Supporting Types

- `EmailAuthStatus` union representing idle, loading, success, and error states.
- `PasswordPolicy` capturing length, complexity, and history requirements.
- `VerificationStatus` describing resend state.
