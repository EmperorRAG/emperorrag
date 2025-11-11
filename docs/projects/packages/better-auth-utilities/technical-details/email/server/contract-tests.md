---
post_title: Server Email Contract Tests
author1: Project Management Team
post_slug: server-email-contract-tests
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-server-contract.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- server
	- testing
ai_note: Document drafted with AI assistance
summary: Contract testing approach ensuring server email handlers stay compatible with Better Auth clients.
post_date: 2025-11-11
---

# Server Email Contract Tests

Contract tests validate that our server utilities remain aligned with client expectations and the Better Auth specification.

## Sign-Up Contract

- Assert the handler responds with the user and session payload shape expected by client adapters.
- Ensure error envelopes include standardized `code`, `message`, and `details` fields.

## Sign-In Contract

- Verify remember-me cookies are set according to the API specification.
- Confirm unverified email responses contain the `requiresVerification` flag consumed by clients.

## Sign-Out Contract

- Ensure the handler returns HTTP 204 with no body and revokes all relevant sessions.

## Verification and Reset Contracts

- Validate verification and reset handlers emit redirect URLs and token lifetimes consistent with documented values.
- Confirm error responses for expired or invalid tokens match the schema consumed by client error mappers.
