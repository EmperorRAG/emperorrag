/**
 * @file packages/prisma/better-auth-db/src/lib/client/client.ts
 * @description Better Auth client initialization.
 */

import { createAuthClient } from '@emperorrag/better-auth-utilities/client';
import { betterAuthConfig } from '../config/config';

/**
 * Creates a Better Auth client configured with the shared plugin suite and base settings.
 *
 * @remarks
 * This client export allows downstream applications—such as Next.js frontends or integration tests—
 * to perform typed operations against the Better Auth server using the same configuration used by
 * the microservice.
 */
export const authClient = createAuthClient(betterAuthConfig);
