---
post_title: Server Email Utility Functions
author1: Project Management Team
post_slug: server-email-utility-functions
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-server-utilities.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- server
	- utilities
ai_note: Document drafted with AI assistance
summary: Utility helpers backing Better Auth email functionality on the server.
post_date: 2025-11-11
---

# Server Email Utility Functions

Utility helpers encapsulate cross-cutting behavior for the email feature set.

## Email Composition

- `buildVerificationEmailPayload(user: User, token: string, callbackUrl: string): VerificationEmailPayload`
- `buildPasswordResetEmailPayload(user: User, token: string, redirectTo: string): PasswordResetEmailPayload`

## Security Helpers

- `hashPassword(password: string, hasher: PasswordHasher): Promise<string>`
- `comparePassword(password: string, hash: string, hasher: PasswordHasher): Promise<boolean>`

## Redirect Helpers

- `normalizeCallbackUrl(clientCallback: string | undefined, fallback: string): string`

## Audit Helpers

- `createAuditEventPayload(event: EmailAuthAuditEvent, context: AuditContext): AuditPayload`
