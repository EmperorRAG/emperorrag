import { Effect } from 'effect';
import type { UpdateUserServerProps } from './updateUser.types.js';
import { UserAuthServerApiError } from '../shared/user.error.js';

/**
 * Updates the user's information (Server-Side).
 *
 * @description Wraps the Better Auth `api.updateUser` method in an Effect.
 * @param deps - The dependencies required for the operation (auth).
 * @returns A function that takes the input and returns an Effect.
 */
export const updateUserServer: UpdateUserServerProps = (deps) => (input) => {
	const { authServer } = deps;

	return Effect.tryPromise({
		try: async () => {
			const result = await authServer.api.updateUser(input);
			if (!result) {
				throw new Error('User not found or update failed');
			}
			return result;
		},
		catch: (error) => {
			const message = error instanceof Error ? error.message : 'Failed to update user';
			const status = error && typeof error === 'object' && 'status' in error ? (error.status as number) : undefined;
			return new UserAuthServerApiError(message, status, error);
		},
	});
};
