import type { Effect } from 'effect';
import type { createAuthClient } from 'better-auth/client';
import type { AuthClientFor } from '../../../../client/client.types.js';
import type { AccountAuthClientDeps } from '../shared/account.types.js';
import type { AccountAuthError } from '../shared/account.error.js';

/**
 * Input for unlinking an account.
 */
export type UnlinkAccountInput<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> = Parameters<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	'unlinkAccount' extends keyof T ? (T['unlinkAccount'] extends (...args: any) => any ? T['unlinkAccount'] : never) : never
>[0];

/**
 * Result of unlinking an account.
 */
export type UnlinkAccountResult<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> = ReturnType<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	'unlinkAccount' extends keyof T ? (T['unlinkAccount'] extends (...args: any) => any ? T['unlinkAccount'] : never) : never
>;

/**
 * Type definition for the unlinkAccount service function.
 */
export interface UnlinkAccountProps<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> {
	(deps: AccountAuthClientDeps<T>): (input: UnlinkAccountInput<T>) => Effect.Effect<Awaited<UnlinkAccountResult<T>>, AccountAuthError>;
}
