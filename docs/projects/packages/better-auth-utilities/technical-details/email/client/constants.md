---
post_title: Client Email Constants Inventory
author1: Project Management Team
post_slug: client-email-constants
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-constants.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- client
	- configuration
ai_note: Document drafted with AI assistance
summary: Source of truth for client-side constants powering the Better Auth email experience.
post_date: 2025-11-11
---

# Client Email Constants

Client adapters rely on shared constants to keep the UX aligned with server expectations. This inventory highlights the values we maintain and how they map to Better Auth features.

## Endpoint Keys

- `EMAIL_SIGN_UP_ENDPOINT` for `authClient.signUp.email` requests.
- `EMAIL_SIGN_IN_ENDPOINT` for `authClient.signIn.email` requests.
- `EMAIL_SIGN_OUT_ENDPOINT` for `authClient.signOut` requests.
- `EMAIL_VERIFICATION_ENDPOINT` for `authClient.sendVerificationEmail`.
- `EMAIL_RESET_PASSWORD_ENDPOINT` for `authClient.requestPasswordReset` and `authClient.resetPassword`.

## Validation Messages

- `PASSWORD_TOO_SHORT_MESSAGE` referencing `minPasswordLength`.
- `PASSWORD_TOO_LONG_MESSAGE` referencing `maxPasswordLength`.
- `EMAIL_REQUIRED_MESSAGE`, `PASSWORD_REQUIRED_MESSAGE`, and `EMAIL_INVALID_MESSAGE` reused throughout forms.

## UI Toggles

- `SHOW_REMEMBER_ME` toggled by configuration for the `rememberMe` checkbox.
- `SHOW_EMAIL_VERIFICATION_ALERT` triggered when `requireEmailVerification` is true post-registration.

## Retry Intervals

- `VERIFICATION_RESEND_COOLDOWN_MS` defines how long to wait before allowing a new verification email request.
- `RESET_EMAIL_RESEND_COOLDOWN_MS` mirrors server throttling for password reset requests.

## Telemetry Identifiers

- `EVENT_SIGN_UP_EMAIL`, `EVENT_SIGN_IN_EMAIL`, `EVENT_SIGN_OUT_EMAIL`, and `EVENT_RESET_PASSWORD_EMAIL` align analytics events with server-side audit logging.
