import { Effect } from 'effect';
import { UserAuthApiError } from '../shared/user.error.js';
import type { UpdateUserProps } from './updateUser.types.js';

/**
 * Update user details.
 *
 * @pure
 * @description Wraps the Better Auth `updateUser` API call in an Effect.
 *
 * @param deps - Dependencies bundle containing the Better Auth client
 * @returns Curried function accepting input and returning an Effect
 */
export const updateUser: UpdateUserProps = (deps) => (input) => {
	const { authClient } = deps;

	return Effect.tryPromise({
		try: async () => {
			const result = await (authClient.updateUser as any)(input);
			if (result?.error) {
				throw result.error;
			}
			return result;
		},
		catch: (error) => {
			const message = (error as any)?.message || (error instanceof Error ? error.message : 'Update user failed');
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const status = error && typeof error === 'object' && 'status' in error ? ((error as any).status as number) : undefined;
			return new UserAuthApiError(message, status, error);
		},
	});
};
