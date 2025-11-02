import { Effect, pipe } from 'effect';
import {
	AdapterContext,
	AdapterResponse,
	AdminUser,
	UnbanUserDependencies,
	UnbanUserOptions,
} from '../../../types/admin/admin.types.js';

class UnbanUserRequestError extends Error {
	readonly _tag = 'UnbanUserRequestError';
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.cause = cause;
	}
}

const createSuccessResponse = (user: AdminUser): AdapterResponse<AdminUser> => ({
	success: true,
	data: user,
	message: 'User unbanned successfully',
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
 * Runs the Better Auth admin unban-user workflow as an Effect pipeline.
 *
 * @description Wraps the admin unban endpoint with declarative logging, error coercion,
 * and response normalization for downstream consumers.
 *
 * @fp-pattern Curried dependency injector returning an Effect computation.
 * @composition
 *   - `pipe(Effect.sync(console.log), Effect.flatMap(Effect.tryPromise), Effect.flatMap(...))`
 *
 * @param dependencies - Functions required to invoke the Better Auth admin API.
 * @returns {Effect.Effect<AdapterResponse<AdminUser>, never, never>} Effect resolving to a
 * normalized adapter response describing the unban action.
 *
 * @example
 * const effect = unbanUser({ unbanUserApi })(payload, { headers });
 * const response = await Effect.runPromise(effect);
 */
export const unbanUser =
	(dependencies: UnbanUserDependencies) =>
	(
		options: UnbanUserOptions,
		context: AdapterContext
	): Effect.Effect<AdapterResponse<AdminUser>> => {
		const { unbanUserApi } = dependencies;

		return pipe(
			Effect.sync(() => console.log('Unbanning Better Auth user:', options.userId)),
			Effect.flatMap(() =>
				Effect.tryPromise({
					try: () =>
						unbanUserApi({
							...options,
							headers: context.headers,
						}),
					catch: (error) => new UnbanUserRequestError('Failed to call admin unbanUser API', error),
				})
			),
			Effect.flatMap((result) => {
				if (result.error) {
					return pipe(
						Effect.sync(() => console.error('Admin unbanUser API returned an error.', result.error)),
						Effect.map(() => createFailureResponse(result.error, 'Failed to unban Better Auth user'))
					);
				}

				if (!result.data) {
					return pipe(
						Effect.sync(() => console.warn('Admin unbanUser API returned no user payload.')),
						Effect.map(() =>
							createFailureResponse(
								undefined,
								'Better Auth unbanUser API did not return a user payload'
							)
						)
					);
				}

				const user = result.data;

				return pipe(
					Effect.sync(() =>
						console.log('Unbanned Better Auth user state:', {
							userId: user.id,
							banned: user.banned,
							banReason: user.banReason,
						})
					),
					Effect.map(() => createSuccessResponse(user))
				);
			}),
			Effect.catchAll((error) =>
				pipe(
					Effect.sync(() => console.error('Unexpected error during admin unbanUser pipeline.', error)),
					Effect.map(() =>
						createFailureResponse(
							error,
							error instanceof Error
								? error.message
								: 'Unexpected error while unbanning Better Auth user'
						)
					)
				)
			)
		);
	};
