---
post_title: Server Email Mocks
author1: Project Management Team
post_slug: server-email-mocks
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-server-mocks.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- server
	- testing
ai_note: Document drafted with AI assistance
summary: Mock implementations for server-side components supporting Better Auth email flows.
post_date: 2025-11-11
---

# Server Email Mocks

Mocks provide deterministic behavior for unit and integration tests without touching external systems.

## Transport Mock

- Captures verification and reset email payloads for assertion.
- Supports configuration to simulate failures (SMTP outage, API error).

## Token Store Mock

- In-memory token storage with configurable expiration, used for unit tests.

## Rate Limiter Mock

- Tracks invocation counts and can simulate throttling scenarios.

## Audit Logger Mock

- Records emitted events for verification in tests without writing to real telemetry pipelines.
