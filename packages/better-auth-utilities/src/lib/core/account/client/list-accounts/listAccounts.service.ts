import * as Effect from 'effect/Effect';
import { AccountAuthApiError } from '../shared/account.error.js';
import type { ListAccountsProps } from './listAccounts.types.js';

/**
 * List all accounts linked to the current user.
 *
 * @pure
 * @description Wraps the Better Auth `listAccounts` API call in an Effect.
 *
 * @param deps - Dependencies bundle containing the Better Auth client
 * @returns Curried function accepting input and returning an Effect
 */
export const listAccountsClient: ListAccountsProps = (deps) => (input) => {
	const { authClient } = deps;

	return Effect.tryPromise({
		try: async () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const { data, error } = await (authClient.listAccounts as any)(input);

			if (error) {
				throw error;
			}

			return data;
		},
		catch: (error) => {
			const errObj = error as any;
			const message = errObj?.message || (error instanceof Error ? error.message : 'List accounts failed');
			const status = errObj?.status;
			return new AccountAuthApiError(message, status, error);
		},
	});
};
