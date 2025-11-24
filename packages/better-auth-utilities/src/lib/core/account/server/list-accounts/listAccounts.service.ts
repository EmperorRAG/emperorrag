import * as Effect from 'effect/Effect';
import { AccountAuthServerApiError } from '../shared/account.error.js';
import type { ListAccountsServerProps } from './listAccounts.types.js';

/**
 * List all accounts linked to the current user (Server).
 *
 * @pure
 * @description Wraps the Better Auth server `listAccounts` API call in an Effect.
 *
 * @param deps - Dependencies bundle containing the Better Auth server instance
 * @returns Curried function accepting params and returning an Effect
 */
export const listAccountsServer: ListAccountsServerProps = (deps) => (params) => {
	const { authServer } = deps;

	return Effect.tryPromise({
		try: async () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const api = authServer.api as any;
			if (typeof api.listAccounts !== 'function') {
				throw new Error('listAccounts method not found on authServer.api');
			}
			return api.listAccounts(params);
		},
		catch: (error) => {
			const message = error instanceof Error ? error.message : 'List accounts failed';
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const status = error && typeof error === 'object' && 'status' in error ? ((error as any).status as number) : undefined;
			return new AccountAuthServerApiError(message, status, error);
		},
	});
};
