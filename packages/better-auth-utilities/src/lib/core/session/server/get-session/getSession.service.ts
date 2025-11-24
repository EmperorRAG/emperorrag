import * as Effect from 'effect/Effect';
import { SessionAuthServerApiError } from '../shared/session.error.js';
import type { GetSessionServerProps } from './getSession.types.js';

/**
 * Retrieves the current user session (Server-Side).
 *
 * @pure
 * @description Wraps the Better Auth `api.getSession` method in an Effect.
 *
 * @param deps - Dependencies bundle containing the Better Auth server
 * @returns Curried function accepting input and returning an Effect
 */
export const getSessionServer: GetSessionServerProps = (deps) => (input) => {
	const { authServer } = deps;

	return Effect.tryPromise({
		try: async () => {
			const result = await authServer.api.getSession(input);
			return result;
		},
		catch: (error) => {
			const message = error instanceof Error ? error.message : 'Get session failed';
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const status = error && typeof error === 'object' && 'status' in error ? ((error as any).status as number) : undefined;
			return new SessionAuthServerApiError(message, status, error);
		},
	});
};
