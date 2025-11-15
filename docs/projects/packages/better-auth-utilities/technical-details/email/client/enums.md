---
post_title: Client Email Enums
author1: Project Management Team
post_slug: client-email-enums
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-enums.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- client
	- typing
ai_note: Document drafted with AI assistance
summary: Enumeration types used by client utilities for Better Auth email workflows.
post_date: 2025-11-11
---

# Client Email Enums

Enumerations create consistent references for status values and error conditions across the client layer.

## EmailAuthViewStep

- `SignUp`, `VerificationPending`, `SignIn`, `PasswordResetRequest`, `PasswordReset`, and `ChangePassword` control UI routing.

## EmailAuthErrorCode

- `InvalidCredentials`, `EmailNotVerified`, `PasswordTooWeak`, `ResetTokenExpired`, and `Unknown` map server errors to display copy.

## EmailVerificationStatus

- `Idle`, `Sending`, `Sent`, `Cooldown`, and `Failed` manage UI states for resend flows.

## PasswordResetStatus

- `Idle`, `Submitting`, `Success`, and `Failed` power button states and messaging on reset forms.
