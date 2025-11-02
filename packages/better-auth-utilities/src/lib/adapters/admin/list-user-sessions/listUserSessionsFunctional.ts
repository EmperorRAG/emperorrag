import { Effect, pipe } from 'effect';
import {
	AdapterContext,
	AdapterResponse,
	AdminSession,
	ListUserSessionsDependencies,
	ListUserSessionsOptions,
} from '../../../types/admin/admin.types.js';

class ListUserSessionsRequestError extends Error {
	readonly _tag = 'ListUserSessionsRequestError';
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.cause = cause;
	}
}

const createSuccessResponse = (
	sessions: ReadonlyArray<AdminSession>
): AdapterResponse<ReadonlyArray<AdminSession>> => ({
	success: true,
	data: sessions,
	message: 'User sessions retrieved successfully',
});

const createFailureResponse = (
	error: unknown,
	message: string
): AdapterResponse<ReadonlyArray<AdminSession>> => ({
	success: false,
	error,
	message,
});

/**
 * Runs the Better Auth admin list-user-sessions workflow via Effect-TS.
 *
 * @description Provides structured logging, error coercion, and response shaping for the
 * admin listUserSessions endpoint.
 *
 * @fp-pattern Curried dependency injector returning an Effect computation.
 * @composition
 *   - `pipe(Effect.sync(console.log), Effect.flatMap(Effect.tryPromise), Effect.flatMap(...))`
 *
 * @param dependencies - Functions required to invoke the Better Auth admin API.
 * @returns {Effect.Effect<AdapterResponse<ReadonlyArray<AdminSession>>, never, never>} Effect resolving
 * to a normalized adapter response describing the list-user-sessions outcome.
 *
 * @example
 * const effect = listUserSessions({ listUserSessionsApi })(payload, { headers });
 * const response = await Effect.runPromise(effect);
 */
export const listUserSessions =
	(dependencies: ListUserSessionsDependencies) =>
	(
		options: ListUserSessionsOptions,
		context: AdapterContext
	): Effect.Effect<AdapterResponse<ReadonlyArray<AdminSession>>> => {
		const { listUserSessionsApi } = dependencies;

		return pipe(
			Effect.sync(() => console.log('Listing Better Auth user sessions for:', options.userId)),
			Effect.flatMap(() =>
				Effect.tryPromise({
					try: () =>
						listUserSessionsApi({
							...options,
							headers: context.headers,
						}),
					catch: (error) =>
						new ListUserSessionsRequestError('Failed to call admin listUserSessions API', error),
				})
			),
			Effect.flatMap((result) => {
				if (result.error) {
					return pipe(
						Effect.sync(() =>
							console.error('Admin listUserSessions API returned an error.', result.error)
						),
						Effect.map(() =>
							createFailureResponse(result.error, 'Failed to list Better Auth user sessions')
						)
					);
				}

				const sessions = result.data ?? [];

				return pipe(
					Effect.sync(() =>
						console.log('Retrieved Better Auth user sessions count:', sessions.length)
					),
					Effect.map(() => createSuccessResponse(sessions))
				);
			}),
			Effect.catchAll((error) =>
				pipe(
					Effect.sync(() =>
						console.error('Unexpected error during admin listUserSessions pipeline.', error)
					),
					Effect.map(() =>
						createFailureResponse(
							error,
							error instanceof Error
								? error.message
								: 'Unexpected error while listing Better Auth user sessions'
						)
					)
				)
			)
		);
	};
