/**
 * @file packages/prisma/better-auth-db/src/lib/prisma-better-auth-db.ts
 * @description Main export file for prisma-better-auth-db library
 */

// Export configuration
export { betterAuthConfig } from './config/config.js';

// Export server instance
export { authServer } from './server/server.js';

// Export client instance
export { authClient } from './client/client.js';

// Re-export types from better-auth-utilities
export type { AuthProvider, AvailablePlugins, BetterAuthConfig, ClientConfig, ServerConfig } from '@emperorrag/better-auth-utilities';
