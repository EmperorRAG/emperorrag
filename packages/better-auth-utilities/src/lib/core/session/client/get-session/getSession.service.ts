import * as Effect from 'effect/Effect';
import { SessionAuthApiError } from '../shared/session.error.js';
import type { GetSessionProps } from './getSession.types.js';

/**
 * Retrieves the current user session.
 *
 * @pure
 * @description Wraps the Better Auth `getSession` API call in an Effect.
 *
 * @param deps - Dependencies bundle containing the Better Auth client
 * @returns Curried function accepting input and returning an Effect
 */
export const getSession: GetSessionProps = (deps) => (input) => {
	const { authClient } = deps;

	return Effect.tryPromise({
		try: async () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const result = await (authClient.getSession as any)(input);
			if (result?.error) {
				throw result.error;
			}
			return result;
		},
		catch: (error) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const message = (error as any)?.message || (error instanceof Error ? error.message : 'Get session failed');
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const status = error && typeof error === 'object' && 'status' in error ? ((error as any).status as number) : undefined;
			return new SessionAuthApiError(message, status, error);
		},
	});
};
