/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/shared/account.service.ts
 * @description Effect Context service for account authentication operations.
 */

import * as Layer from 'effect/Layer';
import * as Context from 'effect/Context';
import type { AccountAuthServerService, AccountAuthServerServiceFor } from './account.types';
import type { AuthServerFor } from '../../../server.types';

/**
 * Effect Context tag for AccountAuthServerService.
 *
 * @pure
 * @description Provides type-safe access to the authServer instance through Effect's context layer.
 * Use with `Effect.provideService` to inject the dependency.
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { AccountAuthServerServiceTag } from './account.service';
 *
 * const program = Effect.flatMap(AccountAuthServerServiceTag, ({ authServer }) =>
 *   Effect.tryPromise(() => authServer.api.listAccounts({ headers }))
 * );
 *
 * await Effect.runPromise(
 *   program.pipe(Effect.provideService(AccountAuthServerServiceTag, { authServer }))
 * );
 * ```
 */
export const AccountAuthServerServiceTag = Context.GenericTag<AccountAuthServerService>('@app/AccountAuthServerService');

/**
 * Creates an Effect Layer providing the AccountAuthServerService.
 *
 * @pure
 * @description Factory function to create a Layer that provides the authServer
 * through Effect's context layer. Use with `Effect.provide` for layer-based DI.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 * @param authServer - The Better Auth server instance
 * @returns Layer providing AccountAuthServerService
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { AccountAuthServerLayer } from './account.service';
 *
 * const layer = AccountAuthServerLayer(authServer);
 *
 * await Effect.runPromise(
 *   program.pipe(Effect.provide(layer))
 * );
 * ```
 */
export const AccountAuthServerLayer = <T extends AuthServerFor>(authServer: T) =>
	Layer.succeed(AccountAuthServerServiceTag, { authServer } satisfies AccountAuthServerServiceFor<T>);
