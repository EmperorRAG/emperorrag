---
post_title: Server Email Interfaces
author1: Project Management Team
post_slug: server-email-interfaces
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-server-interfaces.jpg"
categories:
  - internal-documentation
tags:
  - better-auth
  - email-authentication
  - server
  - typing
ai_note: Document drafted with AI assistance
summary: Interface definitions for server components implementing Better Auth email flows.
post_date: 2025-11-11
---

# Server Email Interfaces

Interfaces define the contracts between controllers, services, and infrastructure.

## EmailAuthService

- `signUpEmail: (deps: EmailAuthServerDeps) => (input: SignUpEmailServerInput) => Promise<SignUpEmailServerResult>`
- `signInEmail: (deps: EmailAuthServerDeps) => (input: SignInEmailServerInput) => Promise<SignInEmailServerResult>`
- `signOut: (deps: EmailAuthServerDeps) => (context: SessionContext) => Promise<void>`
- `sendVerificationEmail: (deps: EmailAuthServerDeps) => (input: VerificationEmailServerInput) => Promise<void>`
- `requestPasswordReset: (deps: EmailAuthServerDeps) => (input: PasswordResetRequestServerInput) => Promise<void>`
- `resetPassword: (deps: EmailAuthServerDeps) => (input: ResetPasswordServerInput) => Promise<void>`
- `changePassword: (deps: EmailAuthServerDeps) => (input: ChangePasswordServerInput) => Promise<void>`

## EmailAuthServiceFactory

- Higher-order orchestration utilities may wrap these curried functions, but the canonical signature remains `(deps) => (input) => result` to align with functional composition practices.
- `createEmailAuthService: (deps: EmailAuthServerDeps) => PreloadedEmailAuthService` binds dependencies once and returns handlers tailored for controller usage.

## EmailTransport

- `sendVerificationEmail(payload: VerificationEmailPayload): Promise<void>`
- `sendPasswordResetEmail(payload: PasswordResetEmailPayload): Promise<void>`

## TokenStore

- `createToken(input: TokenCreateInput): Promise<TokenRecord>`
- `consumeToken(input: TokenConsumeInput): Promise<TokenRecord>`
- `invalidateTokens(criteria: TokenInvalidateInput): Promise<void>`
