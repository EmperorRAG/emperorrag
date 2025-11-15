---
post_title: Server Email Factories
author1: Project Management Team
post_slug: server-email-factories
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-server-factories.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- server
	- factories
ai_note: Document drafted with AI assistance
summary: Factories that construct configured server components for Better Auth email functionality.
post_date: 2025-11-11
---

# Server Email Factories

Factories assemble reusable server components with consistent configuration.

## Auth Module Factory

- Wraps `betterAuth` creation with environment-specific options (database clients, email callbacks, password policies).

## Email Transport Factory

- Instantiates nodemailer transports or API clients based on configuration, exposing a unified interface for verification and reset emails.

## Token Service Factory

- Produces services responsible for creating, storing, and validating verification and reset tokens with pluggable storage backends.

## Rate Limiter Factory

- Builds limiter instances keyed by email and IP address for resend and login attempts.
