---
post_title: Client Email Services
author1: Project Management Team
post_slug: client-email-services
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-services.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- client
	- services
ai_note: Document drafted with AI assistance
summary: Service layer responsibilities for client utilities managing Better Auth email functionality.
post_date: 2025-11-11
---

# Client Email Services

Services wrap the raw client adapters with additional orchestration, caching, and telemetry.

## EmailAuthService

- Exposes high-level methods for sign-up, sign-in, sign-out, verification, and password recovery.
- Implements retry and backoff strategies for transient network failures.
- Maps server responses to domain-specific success or error objects used by controllers.

## SessionService

- Persists session tokens conditionally based on `rememberMe` preferences.
- Provides hooks for clearing storage after sign-out or password reset.

## VerificationService

- Tracks resend cooldowns and caches verification attempts to keep the UI consistent across tabs.

## PasswordPolicyService

- Fetches policy data from the server, merges it with defaults, and exposes normalized rules to validation functions.
