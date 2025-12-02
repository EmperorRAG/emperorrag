import type * as Effect from 'effect/Effect';
import type { createAuthClient } from 'better-auth/client';
import type { AuthClientFor } from '../../../client.types';
import type { AccountAuthClientDeps } from '../shared/account.types';
import type { AccountAuthError } from '../shared/account.error';

/**
 * Input for listing accounts.
 */
export type ListAccountsInput<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> = Parameters<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	'listAccounts' extends keyof T ? (T['listAccounts'] extends (...args: any) => any ? T['listAccounts'] : never) : never
>[0];

/**
 * Result of listing accounts.
 */
export type ListAccountsResult<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> = ReturnType<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	'listAccounts' extends keyof T ? (T['listAccounts'] extends (...args: any) => any ? T['listAccounts'] : never) : never
>;

/**
 * Type definition for the listAccounts service function.
 */
export interface ListAccountsProps<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> {
	(deps: AccountAuthClientDeps<T>): (input?: ListAccountsInput<T>) => Effect.Effect<Awaited<ListAccountsResult<T>>, AccountAuthError>;
}
