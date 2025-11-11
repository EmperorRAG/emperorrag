---
post_title: Client Email Schemas
author1: Project Management Team
post_slug: client-email-schemas
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-schemas.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- client
	- validation
ai_note: Document drafted with AI assistance
summary: Schema definitions that validate client-side payloads for Better Auth email endpoints.
post_date: 2025-11-11
---

# Client Email Schemas

Schema definitions enforce payload correctness before requests reach Better Auth.

## Sign-Up Schema

- Fields: `name`, `email`, `password`, optional `image`, optional `callbackURL`.
- Rules: Password length 8-128, email shape validation, image URL optional but must be https when present.

## Sign-In Schema

- Fields: `email`, `password`, optional `rememberMe`, optional `callbackURL`.
- Rules: `rememberMe` defaults to false, callback URL validated against whitelist.

## Sign-Out Schema

- Fields: optional `fetchOptions` object with allowed keys (method overrides, redirect target).
- Rules: No body payload permitted when `fetchOptions` is omitted.

## Verification and Reset Schemas

- `sendVerificationEmail`: requires `email`, optional `callbackURL`.
- `requestPasswordReset`: requires `email`, optional `redirectTo`.
- `resetPassword`: requires `token` and `newPassword` plus policy validation.
- `changePassword`: requires `currentPassword`, `newPassword`, optional `revokeOtherSessions`.
