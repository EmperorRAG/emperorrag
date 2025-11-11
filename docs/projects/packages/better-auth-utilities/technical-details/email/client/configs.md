---
post_title: Client Email Config Reference
author1: Project Management Team
post_slug: client-email-configs
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-configs.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- client
	- configuration
ai_note: Document drafted with AI assistance
summary: Configuration touchpoints the client utilities must respect when interacting with Better Auth email flows.
post_date: 2025-11-11
---

# Client Email Configs

Client utilities derive much of their behavior from server-provided metadata and shared configuration constants. This document captures the knobs that influence client-side email flows.

## Feature Flags

- Respect `emailAndPassword.enabled`; when false, hide sign-up and sign-in entry points and provide guidance for alternative auth paths.
- Read `emailAndPassword.requireEmailVerification` to decide whether to prompt for verification after registration and to show retry actions on login.

## Redirect Management

- Allow feature consumers to supply a default `callbackURL` that is appended to sign-up, sign-in, verification, and reset requests.
- Enforce a whitelist of domains for redirects to prevent open redirect vulnerabilities.

## Password Policy Awareness

- Surface `minPasswordLength` and `maxPasswordLength` constraints in validation messaging and UI hints.
- When enhanced policies are provided (for example, complexity requirements), ensure the client renders them contextually before submission.

## Session Persistence Preferences

- Default `rememberMe` to workspace guidance and allow overrides per authentication attempt.
- Provide configuration flags to disable the checkbox entirely when session lifetime must be short.

## Email Delivery Providers

- Mirror server settings that dictate whether verification or reset emails are delivered via platform APIs or require manual confirmation.
- Allow optional feature toggles that reveal fallback UX (for example, copy token) if email delivery is unavailable in non-Node runtimes.
