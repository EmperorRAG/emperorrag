---
post_title: Client Email E2E Tests
author1: Project Management Team
post_slug: client-email-e2e-tests
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-e2e.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- client
	- testing
ai_note: Document drafted with AI assistance
summary: End-to-end test coverage for client experiences built on Better Auth email flows.
post_date: 2025-11-11
---

# Client Email End-to-End Tests

These scenarios execute through the browser and integrate with mocked or staging Better Auth endpoints to validate user journeys.

## Sign-Up Happy Path

- Fill form data, submit, expect success toast, and prompt for verification when required.
- Verify analytics events fire for sign-up completion.

## Sign-In With Remember Me

- Log in with valid credentials, toggle `rememberMe`, and confirm session persistence across reloads.
- Ensure unverified accounts trigger the verification re-send flow instead of granting access.

## Sign-Out

- Sign in, navigate to protected content, sign out, and confirm redirect to the public landing page plus cleared local storage.

## Email Verification Loop

- Trigger verification request, simulate link click, and confirm the client processes success and clears pending tasks.

## Password Reset Journey

- Request a reset email, follow the reset link, submit a new password, sign in with the new password, and ensure the old password fails.
