---
post_title: Better Auth Integration Overview
author1: EmperorRAG
post_slug: prisma-better-auth-db-auth
microsoft_alias: n-a
featured_image: n-a
categories:
  - documentation
tags:
  - better-auth
  - prisma
  - nx
ai_note: Generated with AI assistance
summary: Reference for the Better Auth configuration composed in auth.ts within the prisma Better Auth DB package.
post_date: 2025-11-10
---

# Better Auth Configuration (auth.ts)

- **Workspace Path:** `packages/prisma/better-auth-db/src/lib/auth`
- **Project Root Path:** `lib/auth`
- **Primary File:** `auth.ts`

## Purpose

`auth.ts` centralizes the Better Auth configuration used by the Prisma-backed microservice and any
downstream clients. It wires a shared plugin map, constructs server and client configurations, and
exports fully typed helpers for both runtime environments.

## Imports

- `@emperorrag/better-auth-utilities/config` for `defineConfig`, `createServerConfig`, and
  `createClientConfig` builders.
- `@emperorrag/better-auth-utilities/server` and `@emperorrag/better-auth-utilities/client` for the
  Better Auth factory functions and associated type helpers.
- `better-auth/plugins` for the plugin constructors enabled by the project (username, JWT, bearer,
  admin, organization, apiKey). Commented sections highlight optional plugins (email OTP,
  two-factor) that can be re-enabled without altering the structure.
- `PrismaClient` from the generated Prisma client bundle, providing persistence for Better Auth.

## Exports

- `betterAuthConfig` – unified configuration object consumed by both server and client creation
  utilities.
- `authServer` – Better Auth server configured with Prisma persistence.
- `authClient` – Browser/server-friendly client configured with the same plugin suite.
- Type helpers including `AuthServer`, `AuthServerApi`, `AuthServerApiEndpoint`, `AuthClient`,
  `AuthClientApi`, `AuthClientError`, `AuthClientApiSignInArgs`, and session-related helpers that
  provide strongly typed contracts for downstream code.

## Runtime Expectations

- **Environment variables:** `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and optional user identifiers
  (`BETTER_AUTH_NEST_JS_MICROSERVICE_USER_ID`, `BETTER_AUTH_NEXT_JS_FRONTEND_USER_ID`) should be set
  in production deployments. Defaults exist for local development.
- **Database:** A Prisma-managed PostgreSQL database must be reachable by the generated client.
- **CORS:** Trusted origins are configured for localhost ports 3000, 3001, and 4200 by default.

## Usage Examples

Creating a server instance inside NestJS:

```ts
import { authServer } from '@emperorrag/prisma-better-auth-db/lib/auth/auth';

async function bootstrapAuth() {
  const app = await NestFactory.create(AppModule);
  app.use('/api/auth', authServer.createHandler());
}
```

Using the shared client in a Next.js application:

```ts
import { authClient } from '@emperorrag/prisma-better-auth-db/lib/auth/auth';

export async function signInWithEmail(email: string, password: string) {
  return authClient.signIn.email({ email, password });
}
```

## Extension Points

- Uncomment the `emailOTP` and `twoFactor` sections to enable additional verification flows.
  Provide production-ready delivery mechanisms before deploying.
- Additional Better Auth plugins follow the same structure—register the plugin factory in the
  `plugins` object, then add its identifier to the `enabledServerPlugins` and/or
  `enabledClientPlugins` arrays.

## Testing Guidance

- Rebuild the package (`nx build prisma-better-auth-db`) to regenerate bundled artifacts after
  editing `auth.ts`.
- Consumers should rely on the exported type aliases for test typings rather than redefining shapes
  (for example, use `AuthClientApiSignInArgs` when constructing sign-in payloads in integration
  tests).
