---
post_title: Server Email Pure Functions
author1: Project Management Team
post_slug: server-email-pure-functions
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-server-pure-functions.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- server
	- functional-programming
ai_note: Document drafted with AI assistance
summary: Side-effect free utilities used by server components in Better Auth email flows.
post_date: 2025-11-11
---

# Server Email Pure Functions

Pure functions support deterministic behavior for validation, token management, and logging.

## Validation Helpers

- `sanitizeEmail(input: string): string`
- `validatePasswordAgainstPolicy(password: string, policy: PasswordPolicy): ValidationResult`
- `validateCallbackUrl(url: string, allowedOrigins: string[]): ValidationResult`

## Token Calculations

- `calculateTokenExpiry(now: Date, ttlSeconds: number): Date`
- `isTokenExpired(expiresAt: Date, now: Date): boolean`

## Audit Mapping

- `mapServiceResultToAuditEvent(result: EmailServiceResult): EmailAuthAuditEvent`
- `mapErrorToAuditFailure(error: Error): EmailAuthErrorCode`
