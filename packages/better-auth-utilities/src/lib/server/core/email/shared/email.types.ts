/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/shared/email.types.ts
 * @description Server-side dependency types for email authentication operations.
 */

import type { betterAuth } from 'better-auth';
import type { AuthServerFor } from '../../../server.types';

/**
 * Shared dependency type for server email authentication operations.
 *
 * @pure
 * @description Defines the dependency bundle containing the Better Auth server instance,
 * used across all server email operations (signInEmail, signUpEmail, signOut, changePassword, etc.).
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
 * import type { EmailAuthServerDeps } from './email.types';
 *
 * // Create server with plugins
 * const authServer = betterAuth({
 *   plugins: [username(), admin(), organization()]
 * });
 *
 * // Type-safe dependencies
 * const deps: EmailAuthServerDeps<typeof authServer> = {
 *   authServer
 * };
 *
 * // Now auth.api includes plugin methods
 * await deps.authServer.api.signInEmail({ ... });
 * await deps.authServer.api.createApiKey({ ... });
 * ```
 */
export type EmailAuthServerDeps<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = Readonly<{
	authServer: T;
}>;
