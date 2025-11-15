---
post_title: Client Email Contract Tests
author1: Project Management Team
post_slug: client-email-contract-tests
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-contract.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- client
	- testing
ai_note: Document drafted with AI assistance
summary: Contract testing requirements to keep client email adapters aligned with Better Auth APIs.
post_date: 2025-11-11
---

# Client Email Contract Tests

Contract tests protect against drift between the client utilities and the Better Auth API. They simulate real network exchanges to ensure payloads and responses remain compatible.

## Sign-Up Contract

- Assert the client sends the exact set of properties documented by `signUp.email` and rejects unexpected additions.
- Validate the response parser handles success payloads (user, session, callback redirect) and standard error envelopes.

## Sign-In Contract

- Exercise combinations of `rememberMe` and `callbackURL` to ensure defaults serialize correctly.
- Confirm that error codes for invalid credentials and unverified email are mapped to deterministic client error types.

## Sign-Out Contract

- Verify the client forwards session cookies and handles empty success bodies.
- Ensure revocation errors bubble through as actionable retry guidance.

## Verification and Reset Contracts

- Test `sendVerificationEmail`, `requestPasswordReset`, and `resetPassword` flows end-to-end against the API mocks exported from the server project.
- Confirm token lifetimes and redirect instructions are preserved exactly as returned by the server.
