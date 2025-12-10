/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/shared/oauth.service.ts
 * @description Effect Context service tag and layer for OAuth server operations.
 */

import * as Context from 'effect/Context';
import * as Layer from 'effect/Layer';
import type { AuthServerFor } from '../../../server.types';
import type { OAuthAuthServerService, OAuthAuthServerServiceFor } from './oauth.types';

/**
 * Effect Context tag for OAuth server service.
 *
 * @pure
 * @description Provides the authServer dependency through Effect's Context layer.
 * Use with Effect.provideService or Effect.flatMap to access the service.
 *
 * @example
 * ```typescript
 * import { Effect } from 'effect';
 * import { OAuthAuthServerServiceTag } from './oauth.service';
 *
 * const program = Effect.flatMap(OAuthAuthServerServiceTag, ({ authServer }) =>
 *   Effect.tryPromise({
 *     try: () => authServer.api.signInSocial(params),
 *     catch: (error) => new CoreAuthServerApiError(error.message)
 *   })
 * );
 *
 * // Provide the service and run
 * await Effect.runPromise(
 *   Effect.provideService(program, OAuthAuthServerServiceTag, { authServer })
 * );
 * ```
 */
export const OAuthAuthServerServiceTag = Context.GenericTag<OAuthAuthServerService>('@app/OAuthAuthServerService');

/**
 * Creates an Effect Layer for providing the OAuth server service.
 *
 * @pure
 * @description Constructs a Layer that provides the OAuthAuthServerService
 * with the given authServer instance.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 * @param authServer - The Better Auth server instance
 * @returns A Layer that provides OAuthAuthServerService
 *
 * @example
 * ```typescript
 * import { Effect, Layer } from 'effect';
 * import { OAuthAuthServerLayer } from './oauth.service';
 *
 * const layer = OAuthAuthServerLayer(authServer);
 *
 * const program = signInSocialServerService({
 *   body: { provider: 'google' },
 *   headers: request.headers
 * });
 *
 * await Effect.runPromise(
 *   Effect.provide(program, layer)
 * );
 * ```
 */
export const OAuthAuthServerLayer = <T extends AuthServerFor>(authServer: T) =>
	Layer.succeed(OAuthAuthServerServiceTag, { authServer } satisfies OAuthAuthServerServiceFor<T>);
