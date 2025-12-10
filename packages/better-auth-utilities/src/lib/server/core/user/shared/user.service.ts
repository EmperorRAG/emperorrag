/**
 * @file libs/better-auth-utilities/src/lib/core/user/server/shared/user.service.ts
 * @description Effect Context service tag and layer for user authentication operations.
 */

import * as Layer from 'effect/Layer';
import { AuthServerTag } from '../../../server.service';
import type { AuthServerFor } from '../../../server.types';

export { AuthServerTag };

/**
 * Effect Context tag for user authentication service.
 *
 * @pure
 * @description Provides dependency injection for user operations via Effect's context layer.
 * All user services access the authServer through this tag rather than curried function arguments.
 */
// export const AuthServerTag = Context.GenericTag<AuthServerFor>('@app/AuthServerFor');

/**
 * Creates an Effect Layer providing the user authentication service.
 *
 * @pure
 * @description Factory function to create a Layer that satisfies AuthServerTag.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 * @param authServer - The Better Auth server instance
 * @returns Layer providing AuthServerFor
 */
export const UserAuthServerLayer = <T extends AuthServerFor>(authServer: T) => Layer.succeed(AuthServerTag, authServer);
