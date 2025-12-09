/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/shared/account.types.ts
 * @description Server-side dependency types for account authentication operations.
 */

import type { AuthServer, AuthServerFor } from '../../../server.types';

/**
 * Shared dependency type for server account authentication operations.
 *
 * @pure
 * @description Defines the dependency bundle containing the Better Auth server instance,
 * used across all server account operations (listAccounts, unlinkAccount, etc.).
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
 * import type { AccountAuthServerDeps } from './account.types';
 *
 * const authServer = betterAuth({ ... });
 *
 * const deps: AccountAuthServerDeps<typeof authServer> = {
 *   authServer
 * };
 *
 * await deps.authServer.api.listAccounts({ headers });
 * ```
 */
export type AccountAuthServerDeps<T extends AuthServerFor = AuthServerFor> = Readonly<{
	authServer: T;
}>;

/**
 * Service interface for account authentication operations.
 *
 * @pure
 * @description Defines the service contract for Effect Context-based dependency injection.
 * Used with `AccountAuthServerServiceTag` to provide authServer via Effect's context layer.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { AccountAuthServerServiceTag } from './account.service';
 *
 * const program = Effect.flatMap(AccountAuthServerServiceTag, ({ authServer }) =>
 *   Effect.tryPromise(() => authServer.api.listAccounts({ headers }))
 * );
 * ```
 */
export interface AccountAuthServerServiceFor<T extends AuthServerFor = AuthServerFor> {
	readonly authServer: T;
}

/**
 * Default service type using base AuthServer.
 *
 * @pure
 * @description Non-generic alias for `AccountAuthServerServiceFor<AuthServer>`.
 * Use this when the specific server type is not needed.
 */
export type AccountAuthServerService = AccountAuthServerServiceFor<AuthServer>;
