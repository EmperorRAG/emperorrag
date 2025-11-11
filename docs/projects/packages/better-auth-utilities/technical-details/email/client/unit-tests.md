---
post_title: Client Email Unit Tests
author1: Project Management Team
post_slug: client-email-unit-tests
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-unit-tests.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- client
	- testing
ai_note: Document drafted with AI assistance
summary: Unit test coverage expectations for client utilities supporting Better Auth email flows.
post_date: 2025-11-11
---

# Client Email Unit Tests

Unit tests validate pure logic, state transitions, and error mapping without network dependencies.

## Validation Helpers

- Cover positive and negative paths for email, password, and callback URL validators.
- Assert policy updates immediately affect validation outcomes.

## Controllers and Services

- Test state machines for sign-up, sign-in, verification, and reset controllers.
- Verify loading and error states toggle as expected when mocks throw.

## Mappers

- Ensure API error payloads map to correct `EmailAuthErrorCode` values.
- Confirm policy-to-UI hint mapping returns deterministic arrays.

## Utility Functions

- Validate session persistence decisions based on `rememberMe` and environment capabilities.
