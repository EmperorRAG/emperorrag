---
post_title: Server Email Integration Tests
author1: Project Management Team
post_slug: server-email-integration-tests
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-server-integration.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- server
	- testing
ai_note: Document drafted with AI assistance
summary: Integration testing scope for server utilities orchestrating Better Auth email flows.
post_date: 2025-11-11
---

# Server Email Integration Tests

Integration suites run server handlers against in-memory or test databases to validate behavior end-to-end without external dependencies.

## Sign-Up Integration

- Execute sign-up handler, verify user and account records, and capture emitted events.
- Ensure duplicate email detection returns appropriate errors.

## Sign-In Integration

- Validate session creation, remember-me cookie attributes, and rate limiting for failed attempts.

## Sign-Out Integration

- Confirm session revocation across active sessions and audit event emission.

## Verification and Reset Integration

- Test verification resend to ensure cooldown and template rendering operate correctly.
- Validate password reset request, token issuance, token redemption, and optional session revocation.
