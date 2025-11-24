/**
 * @file packages/prisma/better-auth-db/src/lib/server/server.ts
 * @description Better Auth server initialization using Prisma adapter.
 */

import { PrismaClient } from '@prisma/client';
import { createAuthServer } from '@emperorrag/better-auth-utilities/server/server';
import { betterAuthConfig } from '../config/config';

// Initialize Prisma Client
// Note: In production, this should be managed by the PrismaService
const prisma = new PrismaClient();

/**
 * Initializes the Better Auth server using the Prisma adapter and shared configuration.
 *
 * @remarks
 * The Prisma client instance is injected to satisfy Better Auth's persistence requirements. This
 * server export is the primary entry point for NestJS modules as well as other runtime hosts that
 * expect a configured Better Auth HTTP handler.
 */
export const authServer = createAuthServer(betterAuthConfig, prisma);
