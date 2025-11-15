---
post_title: Server Email Services
author1: Project Management Team
post_slug: server-email-services
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-server-services.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- server
	- services
ai_note: Document drafted with AI assistance
summary: Service layer responsibilities for Better Auth email functionality on the server.
post_date: 2025-11-11
---

# Server Email Services

Services encapsulate business logic that orchestrates Better Auth APIs, tokens, and messaging.

## EmailAuthService

- Wraps the underlying `auth` instance to enforce policies, manage transactions, and publish events.
- Provides atomic operations for sign-up, sign-in, sign-out, verification, and password maintenance.

## VerificationService

- Generates verification tokens, persists them, and delegates email delivery to transport adapters.
- Tracks resend cooldowns via the rate limiter.

## PasswordResetService

- Issues reset tokens, stores metadata, sends notifications, validates tokens, and applies new passwords.
- Invokes optional session revocation hooks after password changes.

## SessionService

- Creates and destroys sessions based on sign-in and sign-out operations, respecting `rememberMe` semantics.
