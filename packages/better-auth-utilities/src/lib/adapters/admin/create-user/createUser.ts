import { Effect, pipe } from 'effect';
import {
	AdapterContext,
	AdapterResponse,
	AdminUser,
	CreateUserDependencies,
	CreateUserOptions,
} from '../../../types/admin/admin.types.js';

class CreateUserRequestError extends Error {
	readonly _tag = 'CreateUserRequestError';
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.cause = cause;
	}
}

const createSuccessResponse = (user: AdminUser): AdapterResponse<AdminUser> => ({
	success: true,
	data: user,
	message: 'User created successfully',
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
 * Executes the Better Auth admin create-user workflow via an Effect pipeline.
 *
 * @description Converts the imperative admin `createUser` call into a composable Effect
 * that performs structured logging, error coercion, and typed response shaping.
 *
 * @fp-pattern Curried dependency injector returning an Effect computation.
 * @composition
 *   - `pipe(Effect.sync(console.log), Effect.flatMap(Effect.tryPromise), Effect.flatMap(...))`
 *
 * @param dependencies - Functions required to invoke the Better Auth admin API.
 * @returns {Effect.Effect<AdapterResponse<AdminUser>, never, never>} Effect resolving to a
 * normalized adapter response describing the create-user outcome.
 *
 * @example
 * const effect = createUser({ createUserApi })(payload, { headers });
 * const response = await Effect.runPromise(effect);
 */
export const createUser =
	(dependencies: CreateUserDependencies) =>
	(
		options: CreateUserOptions,
		context: AdapterContext
	): Effect.Effect<AdapterResponse<AdminUser>> => {
		const { createUserApi } = dependencies;

		return pipe(
			Effect.sync(() => console.log('Creating Better Auth user:', options.email)),
			Effect.flatMap(() =>
				Effect.tryPromise({
					try: () =>
						createUserApi({
							...options,
							headers: context.headers,
						}),
					catch: (error) => new CreateUserRequestError('Failed to call admin createUser API', error),
				})
			),
			Effect.flatMap((result) => {
				if (result.error) {
					return pipe(
						Effect.sync(() => console.error('Admin createUser API returned an error.', result.error)),
						Effect.map(() => createFailureResponse(result.error, 'Failed to create Better Auth user'))
					);
				}

				if (!result.data) {
					return pipe(
						Effect.sync(() => console.warn('Admin createUser API returned no user payload.')),
						Effect.map(() =>
							createFailureResponse(
								undefined,
								'Better Auth createUser API did not return a user payload'
							)
						)
					);
				}

						const user = result.data;

						return pipe(
							Effect.sync(() => console.log('Created Better Auth user ID:', user.id)),
							Effect.map(() => createSuccessResponse(user))
						);
			}),
			Effect.catchAll((error) =>
				pipe(
					Effect.sync(() => console.error('Unexpected error during admin createUser pipeline.', error)),
					Effect.map(() =>
						createFailureResponse(
							error,
							error instanceof Error
								? error.message
								: 'Unexpected error while creating Better Auth user'
						)
					)
				)
			)
		);
	};
