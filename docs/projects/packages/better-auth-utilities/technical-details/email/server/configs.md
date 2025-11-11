---
post_title: Server Email Config Reference
author1: Project Management Team
post_slug: server-email-configs
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-server-configs.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- server
	- configuration
ai_note: Document drafted with AI assistance
summary: Server-side configuration levers that drive Better Auth email capabilities.
post_date: 2025-11-11
---

# Server Email Configs

Server configuration determines which email flows are active and how they operate across environments.

## Email & Password Feature Flags

- `emailAndPassword.enabled`: Enables or disables the authenticator entirely.
- `emailAndPassword.requireEmailVerification`: Forces verification before sign-in succeeds.
- `emailAndPassword.disableSignUp`: Blocks public registrations while preserving admin-created accounts.

## Verification Settings

- `emailVerification.sendVerificationEmail`: Callback responsible for dispatching email content.
- `emailVerification.callbackUrl`: Default redirect fallback used when the client omits a value.

## Reset Password Settings

- `emailAndPassword.sendResetPassword`: Handler for reset token notifications.
- `emailAndPassword.resetPasswordTokenExpiresIn`: Duration in seconds for token validity.
- `emailAndPassword.onPasswordReset`: Post-reset hook for audit logging or session revocation.

## Password Policy

- `emailAndPassword.minPasswordLength` and `maxPasswordLength` define bounds shared with clients.
- Optional nested `password` configuration introduces complexity requirements or history enforcement.

## Hashing Strategy

- `emailAndPassword.passwordHasher`: Override default `scrypt` when a different algorithm is mandated.

## Transport Adapters

- Environment-specific configuration selects the email delivery provider (for example, nodemailer transport versus API-based services) per runtime.
