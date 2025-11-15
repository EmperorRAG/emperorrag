---
post_title: Client Email Factories
author1: Project Management Team
post_slug: client-email-factories
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-factories.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- client
	- factories
ai_note: Document drafted with AI assistance
summary: Factories that construct client-side helpers and adapters for Better Auth email workflows.
post_date: 2025-11-11
---

# Client Email Factories

Factories generate configured instances of client helpers based on environment data and shared configuration.

## Auth Client Factory

- Wraps `createAuthClient` with project defaults (base URL, default headers, fetch implementation).
- Injects telemetry hooks and retry strategies appropriate for email flows.

## Form Controller Factory

- Produces controller instances for sign-up, sign-in, verification, and reset, binding validation schemas and UI callbacks.
- Supplies localized copy sets for messaging, enabling per-brand customization.

## Token Poller Factory

- Generates optional pollers that check verification status when real-time updates are required (for example, embedded dashboards).

## Configuration Snapshot Factory

- Delivers memoized configuration snapshots (feature flags, password policies) for use across components and hooks.
