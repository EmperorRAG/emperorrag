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

- `signUpEmail(input: SignUpEmailServerInput): Promise<SignUpEmailServerResult>`
- `signInEmail(input: SignInEmailServerInput): Promise<SignInEmailServerResult>`
- `signOut(context: SessionContext): Promise<void>`
- `sendVerificationEmail(input: VerificationEmailServerInput): Promise<void>`
- `requestPasswordReset(input: PasswordResetRequestServerInput): Promise<void>`
- `resetPassword(input: ResetPasswordServerInput): Promise<void>`
- `changePassword(input: ChangePasswordServerInput): Promise<void>`

## EmailTransport

- `sendVerificationEmail(payload: VerificationEmailPayload): Promise<void>`
- `sendPasswordResetEmail(payload: PasswordResetEmailPayload): Promise<void>`

## TokenStore

- `createToken(input: TokenCreateInput): Promise<TokenRecord>`
- `consumeToken(input: TokenConsumeInput): Promise<TokenRecord>`
- `invalidateTokens(criteria: TokenInvalidateInput): Promise<void>`
