/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/shared/session.service.ts
 * @description Effect Context service tag and layer for session server operations.
 */

import * as Layer from 'effect/Layer';
import { AuthServerTag } from '../../../server.service';
import type { AuthServerFor } from '../../../server.types';

export { AuthServerTag };

/**
 * Effect Context tag for session server service.
 *
 * @pure
 * @deprecated Use AuthServerTag from '../../../server.service' instead.
 * @description Provides the authServer dependency through Effect's Context layer.
 * Use with Effect.provideService or Effect.flatMap to access the service.
 *
 * @example
 * ```typescript
 * import { Effect } from 'effect';
 * import { AuthServerTag } from '../../../server.service';
 * // ...
 * ```
 */
// export const AuthServerTag = Context.GenericTag<AuthServerFor>('@app/AuthServerFor');

/**
 * Creates an Effect Layer for providing the session server service.
 *
 * @pure
 * @deprecated Use AuthServerLayer from '../../../server.service' instead.
 * @description Constructs a Layer that provides the AuthServerFor
 * with the given authServer instance.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 * @param authServer - The Better Auth server instance
 * @returns A Layer that provides AuthServerFor
 *
 * @example
 * ```typescript
 * import { Effect, Layer } from 'effect';
 * import { AuthServerLayer } from '../../../server.service';
 * // ...
 * ```
 */
export const SessionAuthServerLayer = <T extends AuthServerFor>(authServer: T) => Layer.succeed(AuthServerTag, authServer);
