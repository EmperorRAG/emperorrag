---
post_title: Server Email Controllers
author1: Project Management Team
post_slug: server-email-controllers
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-server-controllers.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- server
	- orchestration
ai_note: Document drafted with AI assistance
summary: Controller responsibilities for server routes managing Better Auth email functionality.
post_date: 2025-11-11
---

# Server Email Controllers

Controllers expose REST or RPC endpoints that delegate to the Better Auth email services.

## Sign-Up Controller

- Validates request payloads, invokes `auth.api.signUpEmail`, and sets response cookies.
- Emits audit events for successful registrations.

## Sign-In Controller

- Enforces rate limits, forwards credentials to `auth.api.signInEmail`, and writes session cookies with respect to `rememberMe`.
- Returns verification-required responses with actionable metadata.

## Sign-Out Controller

- Accepts authenticated requests, calls `auth.api.signOut`, and clears session cookies.

## Verification Controller

- Handles manual resend requests via `auth.api.sendVerificationEmail` and tracks cooldown metadata within response headers.

## Password Maintenance Controllers

- `requestPasswordReset` issues tokens and responds with generic success messaging to prevent account enumeration.
- `resetPassword` validates tokens, applies new passwords, and optionally triggers session revocation.
- `changePassword` verifies current credentials before updating stored hashes.
