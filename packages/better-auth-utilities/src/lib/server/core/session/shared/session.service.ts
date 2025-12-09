/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/shared/session.service.ts
 * @description Effect Context service tag and layer for session server operations.
 */

import * as Context from 'effect/Context';
import * as Layer from 'effect/Layer';
import type { AuthServerFor } from '../../../server.types';
import type { SessionAuthServerService, SessionAuthServerServiceFor } from './session.types';

/**
 * Effect Context tag for session server service.
 *
 * @pure
 * @description Provides the authServer dependency through Effect's Context layer.
 * Use with Effect.provideService or Effect.flatMap to access the service.
 *
 * @example
 * ```typescript
 * import { Effect } from 'effect';
 * import { SessionAuthServerServiceTag } from './session.service';
 *
 * const program = Effect.flatMap(SessionAuthServerServiceTag, ({ authServer }) =>
 *   Effect.tryPromise({
 *     try: () => authServer.api.getSession(params),
 *     catch: (error) => new SessionAuthServerApiError(error.message)
 *   })
 * );
 *
 * // Provide the service and run
 * await Effect.runPromise(
 *   Effect.provideService(program, SessionAuthServerServiceTag, { authServer })
 * );
 * ```
 */
export const SessionAuthServerServiceTag = Context.GenericTag<SessionAuthServerService>('@app/SessionAuthServerService');

/**
 * Creates an Effect Layer for providing the session server service.
 *
 * @pure
 * @description Constructs a Layer that provides the SessionAuthServerService
 * with the given authServer instance.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 * @param authServer - The Better Auth server instance
 * @returns A Layer that provides SessionAuthServerService
 *
 * @example
 * ```typescript
 * import { Effect, Layer } from 'effect';
 * import { SessionAuthServerLayer } from './session.service';
 *
 * const layer = SessionAuthServerLayer(authServer);
 *
 * const program = getSessionServerService({
 *   headers: request.headers
 * });
 *
 * await Effect.runPromise(
 *   Effect.provide(program, layer)
 * );
 * ```
 */
export const SessionAuthServerLayer = <T extends AuthServerFor>(authServer: T) =>
	Layer.succeed(SessionAuthServerServiceTag, { authServer } satisfies SessionAuthServerServiceFor<T>);
