import { Effect, pipe } from 'effect';
import {
	AdapterContext,
	AdapterResponse,
	AdminUser,
	ListUsersDependencies,
	ListUsersOptions,
} from '../../../types/admin/admin.types.js';

class ListUsersRequestError extends Error {
	readonly _tag = 'ListUsersRequestError';
		override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.cause = cause;
	}
}

const createSuccessResponse = (
	users: ReadonlyArray<AdminUser>
): AdapterResponse<ReadonlyArray<AdminUser>> => ({
	success: true,
	data: users,
	message: 'Users retrieved successfully',
});

const createFailureResponse = (
	error: unknown,
	message: string
): AdapterResponse<ReadonlyArray<AdminUser>> => ({
	success: false,
	error,
	message,
});

/**
 * Executes the Better Auth admin list-users workflow as an Effect pipeline.
 *
 * @description Wraps the imperative admin API call into a declarative Effect that
 * performs structured logging, error normalization, and response shaping for
 * downstream consumers.
 *
 * @fp-pattern Curried dependency injector returning an Effect-based computation.
 * @composition
 *   - `pipe(Effect.sync(console.log), Effect.flatMap(Effect.tryPromise), Effect.flatMap(...))`
 *
 * @param dependencies - Functions required to reach the Better Auth admin API.
 * @returns {Effect.Effect<AdapterResponse<ReadonlyArray<AdminUser>>, never, never>} Effect yielding
 * a normalized adapter response describing the outcome of the list operation.
 *
 * @example
 * const effect = listUsers({ listUsersApi })({ limit: 10 }, { headers });
 * const response = await Effect.runPromise(effect);
 */
export const listUsers =
	(dependencies: ListUsersDependencies) =>
	(
		options: ListUsersOptions,
		context: AdapterContext
	): Effect.Effect<AdapterResponse<ReadonlyArray<AdminUser>>> => {
		const { listUsersApi } = dependencies;

		return pipe(
			Effect.sync(() => console.log('Listing Better Auth users with options:', options)),
			Effect.flatMap(() =>
				Effect.tryPromise({
					try: () =>
						listUsersApi({
							...options,
							headers: context.headers,
						}),
					catch: (error) => new ListUsersRequestError('Failed to call admin listUsers API', error),
				})
			),
			Effect.flatMap((result) => {
				if (result.error) {
					return pipe(
						Effect.sync(() => console.error('Admin listUsers API returned an error.', result.error)),
						Effect.map(() =>
							createFailureResponse(result.error, 'Failed to list Better Auth users')
						)
					);
				}

				const users = result.data ?? [];

				return pipe(
					Effect.sync(() =>
						console.log('Retrieved Better Auth users count:', users.length)
					),
					Effect.map(() => createSuccessResponse(users))
				);
			}),
			Effect.catchAll((error) =>
				pipe(
					Effect.sync(() => console.error('Unexpected error during admin listUsers pipeline.', error)),
					Effect.map(() =>
						createFailureResponse(
							error,
							error instanceof Error
								? error.message
								: 'Unexpected error while listing Better Auth users'
						)
					)
				)
			)
		);
	};
