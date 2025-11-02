import { Effect, pipe } from 'effect';
import {
	AdapterContext,
	AdapterResponse,
	DeleteUserDependencies,
	DeleteUserResult,
} from '../../../types/admin/admin.types.js';

class DeleteUserRequestError extends Error {
	readonly _tag = 'DeleteUserRequestError';
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.cause = cause;
	}
}

const createSuccessResponse = (
	result: DeleteUserResult
): AdapterResponse<DeleteUserResult> => ({
	success: true,
	data: result,
	message: 'User deleted successfully',
});

const createFailureResponse = (
	error: unknown,
	message: string
): AdapterResponse<DeleteUserResult> => ({
	success: false,
	error,
	message,
});

/**
 * Executes the Better Auth admin delete-user workflow via Effect-TS.
 *
 * @description Performs structured logging, invokes the admin delete endpoint, and
 * wraps the result into a normalized adapter response.
 *
 * @fp-pattern Curried dependency injector returning an Effect-based computation.
 * @composition
 *   - `pipe(Effect.sync(console.log), Effect.flatMap(Effect.tryPromise), Effect.flatMap(...))`
 *
 * @param dependencies - Functions required to reach the Better Auth admin API.
 * @returns {Effect.Effect<AdapterResponse<DeleteUserResult>, never, never>} Effect resolving to a
 * normalized adapter response describing the delete-user outcome.
 *
 * @example
 * const effect = deleteUser({ deleteUserApi })('user-123', { headers });
 * const response = await Effect.runPromise(effect);
 */
export const deleteUser =
	(dependencies: DeleteUserDependencies) =>
	(
		userId: string,
		context: AdapterContext
	): Effect.Effect<AdapterResponse<DeleteUserResult>> => {
		const { deleteUserApi } = dependencies;

		return pipe(
			Effect.sync(() => console.log('Deleting Better Auth user:', userId)),
			Effect.flatMap(() =>
				Effect.tryPromise({
					try: () =>
						deleteUserApi({
							userId,
							headers: context.headers,
						}),
					catch: (error) => new DeleteUserRequestError('Failed to call admin deleteUser API', error),
				})
			),
			Effect.flatMap((result) => {
				if (result.error) {
					return pipe(
						Effect.sync(() => console.error('Admin deleteUser API returned an error.', result.error)),
						Effect.map(() => createFailureResponse(result.error, 'Failed to delete Better Auth user'))
					);
				}

				const payload = result.data ?? { success: false };

				if (!payload.success) {
					return pipe(
						Effect.sync(() => console.warn('Admin deleteUser API reported failure state.')),
						Effect.map(() => createFailureResponse(payload, 'Better Auth deleteUser API reported failure'))
					);
				}

				return pipe(
					Effect.sync(() => console.log('Deleted Better Auth user:', userId)),
					Effect.map(() => createSuccessResponse(payload))
				);
			}),
			Effect.catchAll((error) =>
				pipe(
					Effect.sync(() => console.error('Unexpected error during admin deleteUser pipeline.', error)),
					Effect.map(() =>
						createFailureResponse(
							error,
							error instanceof Error
								? error.message
								: 'Unexpected error while deleting Better Auth user'
						)
					)
				)
			)
		);
	};
