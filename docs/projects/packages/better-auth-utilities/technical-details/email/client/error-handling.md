---
post_title: Client Email Error Handling
author1: Project Management Team
post_slug: client-email-error-handling
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-errors.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- client
	- error-handling
ai_note: Document drafted with AI assistance
summary: Error mapping and recovery strategies for client interactions with Better Auth email APIs.
post_date: 2025-11-11
---

# Client Email Error Handling

Robust error handling keeps the email experience predictable across devices. The points below outline how client utilities should translate server responses.

## Error Normalization

- Convert Better Auth error codes into typed `EmailAuthErrorCode` enums before presenting copy.
- Provide fallbacks for unknown responses to prevent uncaught promise rejections.

## Field-Level Feedback

- Map validation errors to their respective fields (email, password, callback URL) with context-specific messaging.
- When multiple fields fail simultaneously, prioritize password strength messaging followed by email issues.

## Global Alerts

- Render non-field errors (for example, rate limiting, email delivery failures) through persistent alert banners.
- Include retry guidance and contact support options for repeated failures.

## Session Handling

- If sign-in fails due to missing verification, keep credentials in memory, surface the verification prompt, and offer a resend action.
- On sign-out failures, leave the UI in a safe state and provide a manual session clear fallback.

## Telemetry

- Emit structured error events with codes and context to aid in observability and support diagnostics.
