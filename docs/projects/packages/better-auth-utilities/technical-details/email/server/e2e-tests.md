---
post_title: Server Email E2E Tests
author1: Project Management Team
post_slug: server-email-e2e-tests
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-server-e2e.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- server
	- testing
ai_note: Document drafted with AI assistance
summary: End-to-end tests validating Better Auth email flows from the server perspective.
post_date: 2025-11-11
---

# Server Email End-to-End Tests

Server e2e suites spin up the Better Auth module with backing data stores to validate complete journeys.

## Sign-Up and Verification

- Exercise sign-up endpoint, confirm account creation in the database, and assert verification email dispatch with correct token payload.

## Sign-In With Email Verification Required

- Attempt to sign in before verification to ensure the server blocks access and returns retry metadata.
- After completing verification, confirm sign-in succeeds and cookies are set.

## Sign-Out Flow

- Sign in, create additional sessions, invoke sign-out, and verify all relevant session records are marked inactive.

## Password Reset Journey

- Request password reset, persist token, complete reset, and ensure the old password fails while the new password succeeds.

## Change Password With Session Revocation

- Execute change password with `revokeOtherSessions` true and confirm non-current sessions are removed.
