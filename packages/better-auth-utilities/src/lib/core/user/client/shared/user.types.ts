import type { createAuthClient } from 'better-auth/client';
import type { AuthClientFor } from '../../../../client/client.types';

/**
 * Dependencies required for user operations.
 *
 * @description Defines the contract for dependencies that must be injected into
 * user service functions. This ensures that the Better Auth client is available.
 */
export type UserAuthClientDeps<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> = Readonly<{
	/**
	 * The Better Auth client instance.
	 * @see {@link createAuthClient}
	 */
	authClient: T;
}>;
