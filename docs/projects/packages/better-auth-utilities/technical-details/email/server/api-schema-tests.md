---
post_title: Server Email API Schema Tests
author1: Project Management Team
post_slug: server-email-api-schema-tests
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-server-tests.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- server
	- testing
ai_note: Document drafted with AI assistance
summary: Schema validation tests for server handlers implementing Better Auth email endpoints.
post_date: 2025-11-11
---

# Server Email API Schema Tests

Server schema tests guarantee our wrappers around `betterAuth` enforce contract expectations before touching downstream systems.

## Sign-Up Email Schema

- Validate incoming payloads include `name`, `email`, `password`, and optional `image` or `callbackURL` with sanitation applied.
- Ensure password policy constraints mirror the configuration values exposed to clients.

## Sign-In Email Schema

- Confirm `rememberMe` defaults to false when omitted and that `callbackURL` values pass whitelist checks.
- Assert session cookies are required for certain responses and are flagged when missing.

## Sign-Out Schema

- Require authenticated sessions and reject payloads containing unexpected data.

## Verification and Reset Schemas

- Ensure `sendVerificationEmail`, `requestPasswordReset`, `resetPassword`, and `changePassword` handlers enforce presence of required fields and apply rate limiting metadata.
