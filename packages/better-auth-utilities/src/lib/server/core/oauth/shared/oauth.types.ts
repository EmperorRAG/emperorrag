/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/shared/oauth.types.ts
 * @description Server-side dependency types for OAuth authentication operations.
 */

import type { AuthServer, AuthServerFor } from '../../../server.types';

/**
 * Shared dependency type for server OAuth authentication operations.
 *
 * @pure
 * @description Defines the dependency bundle containing the Better Auth server instance,
 * used across all server OAuth operations (signInSocial, callback, etc.).
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
 * import type { OAuthAuthServerDeps } from './oauth.types';
 *
 * // Create server with plugins
 * const authServer = betterAuth({
 *   plugins: [username(), admin(), organization()]
 * });
 *
 * // Type-safe dependencies
 * const deps: OAuthAuthServerDeps<typeof authServer> = {
 *   authServer
 * };
 *
 * // Now auth.api includes plugin methods
 * await deps.authServer.api.signInSocial({ body: { provider: 'google' } });
 * ```
 */
export type OAuthAuthServerDeps<T extends AuthServerFor = AuthServerFor> = Readonly<{
	authServer: T;
}>;

/**
 * Service interface for OAuth authentication operations.
 *
 * @pure
 * @description Defines the structure for the Effect Context service that provides
 * the authServer dependency for OAuth operations.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export interface OAuthAuthServerServiceFor<T extends AuthServerFor = AuthServerFor> {
	readonly authServer: T;
}

/**
 * Concrete service type using the base AuthServer.
 *
 * @pure
 * @description Used as the type parameter for Context.GenericTag to create
 * the OAuthAuthServerServiceTag for dependency injection.
 */
export type OAuthAuthServerService = OAuthAuthServerServiceFor<AuthServer>;
