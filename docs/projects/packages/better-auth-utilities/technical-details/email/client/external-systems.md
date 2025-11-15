---
post_title: Client Email External Systems
author1: Project Management Team
post_slug: client-email-external-systems
microsoft_alias: project.management
featured_image: "https://example.com/images/better-auth-email-integrations.jpg"
categories:
	- internal-documentation
tags:
	- better-auth
	- email-authentication
	- client
	- integrations
ai_note: Document drafted with AI assistance
summary: External systems and services that influence client-side email behavior in Better Auth utilities.
post_date: 2025-11-11
---

# Client Email External Systems

While the client interacts primarily with Better Auth, supporting services shape the UX and data flow.

## Email Delivery Providers

- Clients should detect when the server indicates that verification or reset emails are handled by third-party APIs (for example, SendGrid, AWS SES) and expose appropriate status messaging.
- For environments without direct email sending, surface instructions for manual token entry or alternative contact methods.

## Analytics Platforms

- Emit events to platforms such as PostHog or Segment for sign-up, sign-in, verification, and reset milestones.
- Respect privacy settings and allow opt-out when required by policy.

## Feature Flag Services

- Consume remote flags (LaunchDarkly, GrowthBook) to toggle email flows without redeploying client assets.
- Cache flag values locally to maintain responsiveness when the flag service is unavailable.

## Support Tooling

- Integrate with systems like Zendesk or Intercom to pre-fill support tickets when email recovery repeatedly fails.
