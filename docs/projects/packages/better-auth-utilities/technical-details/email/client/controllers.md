---
post_title: Client Email Controllers
author1: Project Management Team
post_slug: client-email-controllers
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-controllers.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- client
	- orchestration
ai_note: Document drafted with AI assistance
summary: Responsibilities and orchestration patterns for client controllers managing Better Auth email flows.
post_date: 2025-11-11
---

# Client Email Controllers

Controllers coordinate user interaction, form state, and adapter calls. They expose declarative APIs for sign-up, sign-in, verification, and password maintenance.

## Sign-Up Controller

- Collects user profile data and submits to `authClient.signUp.email` while tracking pending state.
- Normalizes server validation errors into field-level feedback.
- Triggers verification banners when `requireEmailVerification` is active.

## Sign-In Controller

- Manages credential entry, `rememberMe` selection, and multi-state feedback for invalid credentials or locked accounts.
- Handles redirect routing using `callbackURL` or global defaults.

## Sign-Out Controller

- Presents confirmation affordances and calls `authClient.signOut` with optional fetch overrides.
- Clears local caches and session indicators after a successful response.

## Verification Controller

- Initiates `authClient.sendVerificationEmail`, tracks resend cooldown, and surfaces status messaging.
- Provides convenience helpers to poll verification status if the hosting app supports it.

## Password Recovery Controller

- Coordinates `requestPasswordReset`, `resetPassword`, and `changePassword` flows with consistent UX messaging.
- Ensures tokens derived from callback URLs are sanitized before invocation.
