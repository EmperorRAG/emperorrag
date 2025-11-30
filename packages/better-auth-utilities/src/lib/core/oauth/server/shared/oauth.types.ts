/**
 * @file libs/better-auth-utilities/src/lib/core/oauth/server/shared/oauth.types.ts
 * @description Shared type definitions for OAuth server operations.
 */

import type { betterAuth } from 'better-auth';
import type { AuthServerFor } from '../../../../server/server.types';

/**
 * Dependencies required for OAuth server operations.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export interface OAuthAuthServerDeps<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> {
	authServer: T;
}
