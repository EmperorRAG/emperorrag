---
post_title: Client Email Mocks
author1: Project Management Team
post_slug: client-email-mocks
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-mocks.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- client
	- testing
ai_note: Document drafted with AI assistance
summary: Mock utilities for simulating Better Auth email behavior in client tests and Storybook scenarios.
post_date: 2025-11-11
---

# Client Email Mocks

Mocks allow us to simulate Better Auth responses without live network calls, enabling deterministic UI tests.

## API Mocks

- `createEmailAuthClientMock` replicates the interface of the real client and supports scenarios like success, validation error, unverified email, and rate limiting.
- Provide helper functions for toggling mock modes within tests.

## Network Layer Mocks

- Fetch interceptors returning canned responses for sign-up, sign-in, sign-out, verification, and reset endpoints.
- Include delay toggles to mimic slow networks for loading state coverage.

## Event Mocks

- Analytics spy that records event payloads for sign-up, sign-in, verification, and reset flows.
- Telemetry sink that asserts error events emit expected codes and metadata.
