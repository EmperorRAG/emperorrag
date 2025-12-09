/**
 * @file libs/better-auth-utilities/src/lib/core/user/server/shared/user.service.ts
 * @description Effect Context service tag and layer for user authentication operations.
 */

import * as Layer from 'effect/Layer';
import * as Context from 'effect/Context';
import type { UserAuthServerService, UserAuthServerServiceFor } from './user.types';
import type { AuthServerFor } from '../../../server.types';

/**
 * Effect Context tag for user authentication service.
 *
 * @pure
 * @description Provides dependency injection for user operations via Effect's context layer.
 * All user services access the authServer through this tag rather than curried function arguments.
 */
export const UserAuthServerServiceTag = Context.GenericTag<UserAuthServerService>('@app/UserAuthServerService');

/**
 * Creates an Effect Layer providing the user authentication service.
 *
 * @pure
 * @description Factory function to create a Layer that satisfies UserAuthServerServiceTag.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 * @param authServer - The Better Auth server instance
 * @returns Layer providing UserAuthServerService
 */
export const UserAuthServerLayer = <T extends AuthServerFor>(authServer: T) =>
	Layer.succeed(UserAuthServerServiceTag, { authServer } satisfies UserAuthServerServiceFor<T>);
