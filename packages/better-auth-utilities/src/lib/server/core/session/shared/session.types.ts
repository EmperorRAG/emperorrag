/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/shared/session.types.ts
 * @description Server-side dependency types for session authentication operations.
 */

import type { AuthServerFor as GlobalAuthServerFor } from '../../../server.types';

/**
 * Shared dependency type for server session authentication operations.
 *
 * @pure
 * @description Defines the dependency bundle containing the Better Auth server instance,
 * used across all server session operations (getSession, etc.).
 *
 * @remarks
 * - Generic type parameter preserves exact server type including plugin augmentations
 * - Readonly prevents accidental mutations of the dependency bundle
 * - Minimal surface area (only authServer) follows dependency injection best practices
 * - Server instance provides access to auth.api.* methods for all operations
 *
 * @template T - The Better Auth server type, defaults to base AuthServerFor type
 *
 * @example
 * ```typescript
 * import { betterAuth } from 'better-auth';
 * import { username, admin, organization } from 'better-auth/plugins';
 * import type { SessionAuthServerDeps } from './session.types';
 *
 * // Create server with plugins
 * const authServer = betterAuth({
 *   plugins: [username(), admin(), organization()]
 * });
 *
 * // Type-safe dependencies
 * const deps: SessionAuthServerDeps<typeof authServer> = {
 *   authServer
 * };
 *
 * // Now auth.api includes plugin methods
 * await deps.authServer.api.getSession({ headers });
 * ```
 */
export type SessionAuthServerDeps<T extends GlobalAuthServerFor = GlobalAuthServerFor> = Readonly<{
	authServer: T;
}>;

export type AuthServerFor = GlobalAuthServerFor;
