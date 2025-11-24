import * as Effect from 'effect/Effect';
import { AccountAuthServerApiError } from '../shared/account.error.js';
import type { UnlinkAccountServerProps } from './unlinkAccount.types.js';

/**
 * Unlink a provider from the current user (Server).
 *
 * @pure
 * @description Wraps the Better Auth server `unlinkAccount` API call in an Effect.
 *
 * @param deps - Dependencies bundle containing the Better Auth server instance
 * @returns Curried function accepting params and returning an Effect
 */
export const unlinkAccountServer: UnlinkAccountServerProps = (deps) => (params) => {
	const { authServer } = deps;

	return Effect.tryPromise({
		try: async () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const api = authServer.api as any;
			if (typeof api.unlinkAccount !== 'function') {
				throw new Error('unlinkAccount method not found on authServer.api');
			}
			return api.unlinkAccount(params);
		},
		catch: (error) => {
			const message = error instanceof Error ? error.message : 'Unlink account failed';
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const status = error && typeof error === 'object' && 'status' in error ? ((error as any).status as number) : undefined;
			return new AccountAuthServerApiError(message, status, error);
		},
	});
};
