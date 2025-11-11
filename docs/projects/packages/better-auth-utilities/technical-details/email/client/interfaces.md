---
post_title: Client Email Interfaces
author1: Project Management Team
post_slug: client-email-interfaces
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-interfaces.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- client
	- typing
ai_note: Document drafted with AI assistance
summary: Interface contracts exposed by client utilities that wrap Better Auth email functionality.
post_date: 2025-11-11
---

# Client Email Interfaces

Interfaces define the shape of public APIs consumed by application code.

## EmailAuthClient

- `signUpEmail(input: SignUpEmailInput): Promise<SignUpEmailResult>`
- `signInEmail(input: SignInEmailInput): Promise<SignInEmailResult>`
- `signOut(options?: SignOutOptions): Promise<void>`
- `sendVerificationEmail(input: VerificationEmailInput): Promise<void>`
- `requestPasswordReset(input: PasswordResetRequestInput): Promise<void>`
- `resetPassword(input: ResetPasswordInput): Promise<void>`
- `changePassword(input: ChangePasswordInput): Promise<void>`

## EmailAuthController

- Exposes state getters (`status`, `error`, `cooldownRemaining`) and methods mirroring the client functions while managing side effects.

## Configuration Interfaces

- `EmailClientConfig` capturing base URL, default callback target, password policy, and resend cooldowns.
- `EmailCopyConfig` containing localized strings for each UI state.
