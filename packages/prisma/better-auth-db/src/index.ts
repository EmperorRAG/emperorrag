/**
 * @file packages/prisma/better-auth-db/src/index.ts
 * @description Public API for the prisma-better-auth-db library.
 */

export { authServer, authClient, betterAuthConfig } from './lib/prisma-better-auth-db';

export type {
	// Re-export types from better-auth-utilities for convenience
	AuthProvider,
	AvailablePlugins,
	BetterAuthConfig,
	ClientConfig,
	ServerConfig,
} from './lib/prisma-better-auth-db';
