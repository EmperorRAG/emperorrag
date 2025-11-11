---
post_title: Server Email Constants Inventory
author1: Project Management Team
post_slug: server-email-constants
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-server-constants.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- server
	- configuration
ai_note: Document drafted with AI assistance
summary: Core constants that server utilities use when orchestrating Better Auth email features.
post_date: 2025-11-11
---

# Server Email Constants

Server modules share constants for clarity and reuse across handlers, services, and tests.

## Table and Provider Identifiers

- `ACCOUNT_TABLE_NAME` referencing the Better Auth account table.
- `CREDENTIAL_PROVIDER_ID` fixed to `credential` for email and password records.

## Email Templates

- `EMAIL_VERIFICATION_TEMPLATE_ID` and `PASSWORD_RESET_TEMPLATE_ID` referencing template keys or file paths.

## Rate Limits

- `VERIFICATION_RESEND_LIMIT_PER_HOUR` controlling throttling.
- `RESET_REQUEST_LIMIT_PER_HOUR` mirroring security policies.

## Token Settings

- `VERIFICATION_TOKEN_TTL_SECONDS` and `RESET_TOKEN_TTL_SECONDS` aligning with configuration defaults.

## Audit Event Keys

- `EVENT_EMAIL_SIGN_UP`, `EVENT_EMAIL_SIGN_IN`, `EVENT_EMAIL_SIGN_OUT`, `EVENT_EMAIL_RESET_REQUEST`, and `EVENT_EMAIL_RESET_SUCCESS` used by telemetry pipelines.
