import { Effect, pipe } from 'effect';
import {
	AdapterContext,
	AdapterResponse,
	AdminUser,
	BanUserDependencies,
	BanUserOptions,
} from '../../../types/admin/admin.types.js';

class BanUserRequestError extends Error {
	readonly _tag = 'BanUserRequestError';
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.cause = cause;
	}
}

const createSuccessResponse = (user: AdminUser): AdapterResponse<AdminUser> => ({
	success: true,
	data: user,
	message: 'User banned successfully',
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
 * Runs the Better Auth admin ban-user workflow as an Effect pipeline.
 *
 * @description Wraps the admin ban endpoint in a declarative computation that performs
 * structured logging and uniform response shaping.
 *
 * @fp-pattern Curried dependency injector returning an Effect computation.
 * @composition
 *   - `pipe(Effect.sync(console.log), Effect.flatMap(Effect.tryPromise), Effect.flatMap(...))`
 *
 * @param dependencies - Functions required to invoke the Better Auth admin API.
 * @returns {Effect.Effect<AdapterResponse<AdminUser>, never, never>} Effect resolving to a
 * normalized adapter response describing the ban action.
 *
 * @example
 * const effect = banUser({ banUserApi })(payload, { headers });
 * const response = await Effect.runPromise(effect);
 */
export const banUser =
	(dependencies: BanUserDependencies) =>
	(
		options: BanUserOptions,
		context: AdapterContext
	): Effect.Effect<AdapterResponse<AdminUser>> => {
		const { banUserApi } = dependencies;

		return pipe(
			Effect.sync(() => console.log('Banning Better Auth user:', options.userId)),
			Effect.flatMap(() =>
				Effect.tryPromise({
					try: () =>
						banUserApi({
							...options,
							headers: context.headers,
						}),
					catch: (error) => new BanUserRequestError('Failed to call admin banUser API', error),
				})
			),
			Effect.flatMap((result) => {
				if (result.error) {
					return pipe(
						Effect.sync(() => console.error('Admin banUser API returned an error.', result.error)),
						Effect.map(() => createFailureResponse(result.error, 'Failed to ban Better Auth user'))
					);
				}

				if (!result.data) {
					return pipe(
						Effect.sync(() => console.warn('Admin banUser API returned no user payload.')),
						Effect.map(() =>
							createFailureResponse(
								undefined,
								'Better Auth banUser API did not return a user payload'
							)
						)
					);
				}

				const user = result.data;

				return pipe(
					Effect.sync(() =>
						console.log('Banned Better Auth user state:', {
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
					Effect.sync(() => console.error('Unexpected error during admin banUser pipeline.', error)),
					Effect.map(() =>
						createFailureResponse(
							error,
							error instanceof Error
								? error.message
								: 'Unexpected error while banning Better Auth user'
						)
					)
				)
			)
		);
	};
