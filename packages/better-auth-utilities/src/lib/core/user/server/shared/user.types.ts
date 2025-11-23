import type { betterAuth } from 'better-auth';
import type { AuthServerFor } from '../../../../server/server.types.js';

/**
 * Dependencies required for user authentication operations (Server).
 *
 * @description Defines the contract for dependencies that must be injected into
 * user authentication services. This ensures that services have access to
 * the Better Auth server instance.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export interface UserAuthServerDeps<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> {
	authServer: T;
}
