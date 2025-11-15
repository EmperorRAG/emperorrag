# Better Auth Database Package

PostgreSQL database schema and Better Auth configuration for the Emperorrag monorepo.

## Package Exports

This package exports Better Auth server and client instances configured with Prisma adapter. It does **not** export the Prisma Client itself - the generated Prisma client remains an internal implementation detail.

### Available Exports

```typescript
// Better Auth client instance
import { authClient, betterAuthConfig } from '@emperorrag/prisma-better-auth-db/client';

// Better Auth server instance
import { authServer, betterAuthConfig } from '@emperorrag/prisma-better-auth-db/server';

// TypeScript types only
import type { AuthClient, AuthServer } from '@emperorrag/prisma-better-auth-db/types';
```

### Main Export

```typescript
// Exports both authClient and authServer
import { authClient, authServer, betterAuthConfig } from '@emperorrag/prisma-better-auth-db';
```

## Prisma Client Usage

The Prisma Client is generated internally and used by the Better Auth configuration. If you need direct database access, the Prisma Client is located at:\n\n```plaintext\npackages/prisma/better-auth-db/prisma/generated/client/\n```\n\nHowever, this is **not exported** from the package. For database operations, consider:

1. Using Better Auth's built-in methods
2. Creating separate database service utilities
3. Accessing the internal Prisma client path directly (development only)

## Initial Setup

```bash
# Generate Prisma Client (from monorepo root)
npx nx run prisma-better-auth-db:prisma-generate

# Apply migrations
npx nx run prisma-better-auth-db:prisma-migrate
```

## Nx Prisma Commands

All Prisma commands are available as Nx targets:

```bash
# Generate Prisma Client
npx nx run prisma-better-auth-db:prisma-generate

# Create and apply migration
npx nx run prisma-better-auth-db:prisma-migrate

# Apply migrations (production)
npx nx run prisma-better-auth-db:prisma-migrate-deploy

# Open Prisma Studio
npx nx run prisma-better-auth-db:prisma-studio

# Push schema without migration
npx nx run prisma-better-auth-db:prisma-push

# Reset database
npx nx run prisma-better-auth-db:prisma-reset

# Validate schema
npx nx run prisma-better-auth-db:prisma-validate
```

## Integration Example

```typescript
// In your application
import { authServer } from '@emperorrag/prisma-better-auth-db/server';
import { authClient } from '@emperorrag/prisma-better-auth-db/client';

// Server-side (NestJS, Express, etc.)
app.use('/api/auth/*', authServer.handler);

// Client-side (Next.js, React, etc.)
const session = await authClient.useSession();
```

## Schema Management

The Prisma schema is located at:

```plaintext
packages/prisma/better-auth-db/prisma/schema.prisma
```

When updating the schema:

1. Modify `schema.prisma`
2. Run `npx nx run prisma-better-auth-db:prisma-migrate` to create migration
3. Run `npx nx run prisma-better-auth-db:prisma-generate` to regenerate client
4. Rebuild the package: `npx nx build prisma-better-auth-db`

## Package Architecture

- **Internal**: Prisma Client generation and database schema
- **Exported**: Better Auth server/client instances configured with Prisma adapter
- **Not Exported**: Raw Prisma Client (use Better Auth methods instead)

## Connection String Format

```plaintext
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"
```

Example:

```plaintext
DATABASE_URL="postgresql://better_auth_user:password@localhost:5432/better_auth_db?schema=public"
```

## Directory Structure

```plaintext
packages/prisma/better-auth-db/
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Migration history
├── src/
│   ├── lib/
│   │   ├── auth/
│   │   │   └── auth.ts         # Better Auth configuration
│   │   └── prisma/
│   │       └── generated/      # Generated client (internal only)
│   ├── client.ts               # Client export
│   ├── server.ts               # Server export
│   ├── types.ts                # Type exports
│   └── index.ts                # Main export
└── dist/                       # Built package (no Prisma client)
```

---

**Last Updated**: November 15, 2025
**Version**: 0.0.1
