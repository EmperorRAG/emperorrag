/**
 * @file libs/better-auth-utilities/src/lib/core/user/server/shared/user.types.ts
 * @description Server-side dependency types for user authentication operations.
 */

import type { AuthServer, AuthServerFor } from '../../../server.types';

/**
 * Shared dependency type for server user authentication operations.
 *
 * @pure
 * @description Defines the dependency bundle containing the Better Auth server instance,
 * used across all server user operations (updateUser, etc.).
 *
 * @remarks
 * - Generic type parameter preserves exact server type including plugin augmentations
 * - Readonly prevents accidental mutations of the dependency bundle
 * - Minimal surface area (only authServer) follows dependency injection best practices
 * - Server instance provides access to auth.api.* methods for all operations
 *
 * @template T - The Better Auth server type, defaults to base AuthServerFor type
 */
export type UserAuthServerDeps<T extends AuthServerFor = AuthServerFor> = Readonly<{
	authServer: T;
}>;

/**
 * Service interface for user authentication operations.
 *
 * @pure
 * @description Defines the service contract for user operations,
 * containing the authServer instance used by all user endpoints.
 *
 * @template T - The Better Auth server type, defaults to base AuthServerFor type
 */
export interface UserAuthServerServiceFor<T extends AuthServerFor = AuthServerFor> {
	readonly authServer: T;
}

/**
 * Concrete service type using the base AuthServer.
 *
 * @pure
 * @description Type alias for UserAuthServerServiceFor with the base AuthServer type.
 */
export type UserAuthServerService = UserAuthServerServiceFor<AuthServer>;
