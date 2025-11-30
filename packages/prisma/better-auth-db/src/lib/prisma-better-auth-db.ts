/**
 * @file packages/prisma/better-auth-db/src/lib/prisma-better-auth-db.ts
 * @description Main export file for prisma-better-auth-db library
 */

// Export configuration
export { betterAuthConfig } from './config/config';

// Export server instance
export { authServer } from './server/server';

// Export client instance
export { authClient } from './client/client';

// Re-export types from better-auth-utilities
export type { AuthProvider, AvailablePlugins, BetterAuthConfig, ClientConfig, ServerConfig } from '@emperorrag/better-auth-utilities';
