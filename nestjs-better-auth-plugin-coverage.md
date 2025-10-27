---
post_title: NestJS Better Auth Plugin Coverage
author1: GitHub Copilot
post_slug: nestjs-better-auth-plugin-coverage
microsoft_alias: githubcopilot
featured_image: https://example.com/placeholder.png
categories:
  - authentication
tags:
  - better-auth
  - nestjs
  - plugins
ai_note: true
summary: Coverage check for the Better Auth plugins configured in the NestJS microservice.
post_date: 2025-10-27
---

# NestJS Better Auth Plugin Coverage

## Source Review

- Library: `@thallesp/nestjs-better-auth`
- Reference: project README (Context7 docs, retrieved Oct 27 2025)
- Behavior: wraps the provided Better Auth instance and forwards every generated
  handler under `/api/auth/**`, exposes type-safe `AuthService<typeof auth>` to
  reach plugin methods.

## Plugin Coverage Matrix

| Plugin           | Covered | Notes |
| ---------------- | ------- | ----- |
| `username`       | Yes     | Exposed through Better Auth core routes; available via `AuthService.api.username.*` utilities. |
| `jwt`            | Yes     | JWT issuance/validation handled by Better Auth handler, reachable without extra wiring. |
| `bearer`         | Yes     | Bearer token endpoints exposed automatically under `/api/auth`. |
| `admin`          | Yes     | Admin APIs surfaced through Better Auth and accessible via injected `AdminService`. |
| `organization`   | Yes     | Organization member and invite endpoints provided via Better Auth handler. |
| `emailOTP`       | Yes     | OTP generation/verification routes handled by Better Auth with configured sender. |
| `twoFactor`      | Yes     | Two-factor enable/verify/disable flows delivered by Better Auth. |
| `apiKey`         | Yes     | API key CRUD operations exposed under `/api/auth/api-keys` and via `APIKeyService`. |

## Unsupported Plugins

No unsupported plugins were identified for the current configuration. The
NestJS adapter forwards any Better Auth plugin functionality defined in
`src/lib/auth.ts`, so future plugins become available automatically once added
there.

## Implementation Notes

- The custom controller under `api/custom-auth` duplicates functionality that is
  already exposed under `/api/auth/**`; keep only if additional business logic is
  needed.
- When adding new Better Auth plugins, regenerate the Prisma schema as required
  and the NestJS adapter will surface the new routes without additional wiring.

## Not Yet Added Supported Plugins

| Plugin            | Notes                                                      |
| ----------------- | ---------------------------------------------------------- |
| `access`          | Role/permission matrix for granular authorization.         |
| `anonymous`       | Anonymous session bootstrap for guest flows.               |
| `captcha`         | Cloudflare Turnstile or reCAPTCHA verification support.    |
| `haveIBeenPwned`  | Password breach checks during sign-up and reset.           |
| `lastLoginMethod` | Persists the last credential type used by a user.          |
| `magicLink`       | Email-based passwordless sign-in flows.                    |
| `multiSession`    | Enables multiple concurrent sessions per account.          |
| `oneTap`          | Google One Tap onboarding endpoints.                       |
| `oneTimeToken`    | Single-use token generation and redemption APIs.           |
| `passkey`         | WebAuthn passkey registration and assertion routes.        |
| `dubAnalytics`    | Dub analytics integration via `@dub/better-auth`.          |
| `mcp`             | Machine Control Protocol OAuth surfaces.                   |
| `stripe`          | Billing hooks exposed by `@better-auth/stripe`.            |
| `expo`            | Expo push session management (`@better-auth/expo`).        |
| `polar`           | Polar checkout and portal handlers.                        |
| `sso`             | Enterprise SSO endpoints from `@better-auth/sso`.          |
| `genericOAuth`    | Custom OAuth provider wiring helper.                       |

All of the above are documented server-side plugins in Better Auth. Because the
NestJS adapter simply mounts the generated handler, each plugin becomes
available automatically after it is added to the `plugins` array and any schema
changes are migrated.

## Not Yet Added Unsupported Plugins

No adapter-specific limitations were documented. The NestJS integration forwards
every Better Auth route, so there are currently no known unsupported server
plugins. Continue to review upstream release notes for future exceptions.
