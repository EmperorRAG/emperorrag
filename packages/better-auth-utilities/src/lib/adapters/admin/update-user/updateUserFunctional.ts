import { Effect, pipe } from 'effect';
import {
	AdapterContext,
	AdapterResponse,
	AdminUser,
	UpdateUserDependencies,
	UpdateUserOptions,
} from '../../../types/admin/admin.types.js';

class UpdateUserRequestError extends Error {
	readonly _tag = 'UpdateUserRequestError';
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.cause = cause;
	}
}

const createSuccessResponse = (user: AdminUser): AdapterResponse<AdminUser> => ({
	success: true,
	data: user,
	message: 'User updated successfully',
});

const createFailureResponse = (
	error: unknown,
	message: string
): AdapterResponse<AdminUser> => ({
	success: false,
	error,
	message,
});

/**
 * Runs the Better Auth admin update-user workflow as an Effect pipeline.
 *
 * @description Converts the imperative admin update operation into a declarative Effect
 * that encapsulates logging, error coercion, and success shaping.
 *
 * @fp-pattern Curried dependency injector returning an Effect computation.
 * @composition
 *   - `pipe(Effect.sync(console.log), Effect.flatMap(Effect.tryPromise), Effect.flatMap(...))`
 *
 * @param dependencies - Functions required to invoke the Better Auth admin API.
 * @returns {Effect.Effect<AdapterResponse<AdminUser>, never, never>} Effect resolving to a
 * normalized adapter response describing the update operation.
 *
 * @example
 * const effect = updateUser({ updateUserApi })(payload, { headers });
 * const response = await Effect.runPromise(effect);
 */
export const updateUser =
	(dependencies: UpdateUserDependencies) =>
	(
		options: UpdateUserOptions,
		context: AdapterContext
	): Effect.Effect<AdapterResponse<AdminUser>> => {
		const { updateUserApi } = dependencies;

		return pipe(
			Effect.sync(() => console.log('Updating Better Auth user:', options.userId)),
			Effect.flatMap(() =>
				Effect.tryPromise({
					try: () =>
						updateUserApi({
							...options,
							headers: context.headers,
						}),
					catch: (error) => new UpdateUserRequestError('Failed to call admin updateUser API', error),
				})
			),
			Effect.flatMap((result) => {
				if (result.error) {
					return pipe(
						Effect.sync(() => console.error('Admin updateUser API returned an error.', result.error)),
						Effect.map(() => createFailureResponse(result.error, 'Failed to update Better Auth user'))
					);
				}

				if (!result.data) {
					return pipe(
						Effect.sync(() => console.warn('Admin updateUser API returned no user payload.')),
						Effect.map(() =>
							createFailureResponse(
								undefined,
								'Better Auth updateUser API did not return a user payload'
							)
						)
					);
				}

				const user = result.data;

				return pipe(
					Effect.sync(() => console.log('Updated Better Auth user ID:', user.id)),
					Effect.map(() => createSuccessResponse(user))
				);
			}),
			Effect.catchAll((error) =>
				pipe(
					Effect.sync(() => console.error('Unexpected error during admin updateUser pipeline.', error)),
					Effect.map(() =>
						createFailureResponse(
							error,
							error instanceof Error
								? error.message
								: 'Unexpected error while updating Better Auth user'
						)
					)
				)
			)
		);
	};
