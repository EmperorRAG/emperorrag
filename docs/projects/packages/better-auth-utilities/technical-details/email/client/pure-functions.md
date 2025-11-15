---
post_title: Client Email Pure Functions
author1: Project Management Team
post_slug: client-email-pure-functions
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-pure-functions.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- client
	- functional-programming
ai_note: Document drafted with AI assistance
summary: Side-effect free helpers supporting validation and state derivation for client email flows.
post_date: 2025-11-11
---

# Client Email Pure Functions

Pure functions keep validation and state derivations predictable and easily testable.

## Validation Helpers

- `validateEmailAddress(email: string): ValidationResult`
- `validatePassword(password: string, policy: PasswordPolicy): ValidationResult`
- `validateCallbackUrl(url: string, whitelist: string[]): ValidationResult`

## State Derivation

- `deriveVerificationStatus(lastSentAt: Date | null, cooldownMs: number, now: Date): VerificationStatus`
- `derivePasswordResetState(requestedAt: Date | null, completedAt: Date | null): PasswordResetStatus`

## Mapping Helpers

- `mapApiErrorToClientError(apiError: ApiError): EmailAuthErrorCode`
- `mapPolicyToUiHints(policy: PasswordPolicy): PasswordHint[]`
