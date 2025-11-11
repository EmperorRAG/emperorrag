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

- `signUpEmail: (deps: EmailAuthClientDeps) => (input: SignUpEmailInput) => Promise<SignUpEmailResult>`
- `signInEmail: (deps: EmailAuthClientDeps) => (input: SignInEmailInput) => Promise<SignInEmailResult>`
- `signOut: (deps: EmailAuthClientDeps) => (options?: SignOutOptions) => Promise<void>`
- `sendVerificationEmail: (deps: EmailAuthClientDeps) => (input: VerificationEmailInput) => Promise<void>`
- `requestPasswordReset: (deps: EmailAuthClientDeps) => (input: PasswordResetRequestInput) => Promise<void>`
- `resetPassword: (deps: EmailAuthClientDeps) => (input: ResetPasswordInput) => Promise<void>`
- `changePassword: (deps: EmailAuthClientDeps) => (input: ChangePasswordInput) => Promise<void>`

## EmailAuthClientFactory

- Optional higher-order helpers may compose these curried functions into concrete implementations, but the base API follows `(deps) => (input) => result` semantics for functional composition.
- `createEmailAuthClient: (deps: EmailAuthClientDeps) => PreloadedEmailAuthClient` binds dependencies once and returns handlers that no longer require the dependency argument when invoked.
- The preloaded bundle includes `signOut` alongside the other email handlers so controllers may reuse a single dependency injection.

## EmailAuthController

- Exposes state getters (`status`, `error`, `cooldownRemaining`) and methods mirroring the client functions while managing side effects.

## Configuration Interfaces

- `EmailClientConfig` capturing base URL, default callback target, password policy, and resend cooldowns.
- `EmailCopyConfig` containing localized strings for each UI state.
