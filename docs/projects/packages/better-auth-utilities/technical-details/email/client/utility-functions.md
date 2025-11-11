---
post_title: Client Email Utility Functions
author1: Project Management Team
post_slug: client-email-utility-functions
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-utilities.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- client
	- utilities
ai_note: Document drafted with AI assistance
summary: Utility helpers that support client-facing Better Auth email experiences.
post_date: 2025-11-11
---

# Client Email Utility Functions

Utility helpers remove repetition across forms and controllers.

## Formatting Helpers

- `formatDisplayEmail(email: string): string` obfuscates sensitive portions for display.
- `formatPasswordPolicy(policy: PasswordPolicy): string[]` produces copy bullets for UX components.

## Storage Helpers

- `persistSession(session: Session, rememberMe: boolean): void` delegates to storage adapters.
- `clearSessionStorage(): void` removes session details during sign-out.

## URL Helpers

- `buildCallbackUrl(base: string, fallback: string): string` picks the most appropriate redirect target.
- `appendTokenToUrl(url: string, token: string): string` ensures consistent query parameter formatting.

## Cooldown Helpers

- `calculateCooldownRemaining(lastSentAt: Date | null, cooldownMs: number, now: Date): number` powers resend timers.
