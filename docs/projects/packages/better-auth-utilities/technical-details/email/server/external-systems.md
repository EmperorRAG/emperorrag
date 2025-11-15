---
post_title: Server Email External Systems
author1: Project Management Team
post_slug: server-email-external-systems
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-server-integrations.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- server
	- integrations
ai_note: Document drafted with AI assistance
summary: External systems the server must coordinate with for Better Auth email functionality.
post_date: 2025-11-11
---

# Server Email External Systems

Server components interact with several external services to deliver the full email experience.

## Email Delivery Providers

- Integrate with providers such as Nodemailer transports, SendGrid, or AWS SES for verification and reset emails.
- Support fallbacks for development environments using console logging or local mail capture.

## Database

- Persist accounts, sessions, and tokens via Prisma models aligned with Better Auth expectations.
- Ensure token records include expiration metadata for cleanup jobs.

## Cache and Rate Limiting Stores

- Utilize Redis or similar stores to enforce resend cooldowns and track failed login attempts.

## Telemetry Pipelines

- Ship audit events to logging or analytics stacks (for example, OpenTelemetry, Datadog) for compliance monitoring.
