import { Effect, pipe } from 'effect';
import {
	AdapterContext,
	AdapterResponse,
	AdminUserSession,
	ImpersonateUserDependencies,
	ImpersonateUserOptions,
} from '../../../types/admin/admin.types.js';

class ImpersonateUserRequestError extends Error {
	readonly _tag = 'ImpersonateUserRequestError';
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.cause = cause;
	}
}

const createSuccessResponse = (
	session: AdminUserSession
): AdapterResponse<AdminUserSession> => ({
	success: true,
	data: session,
	message: 'User impersonation successful',
});

const createFailureResponse = (
	error: unknown,
	message: string
): AdapterResponse<AdminUserSession> => ({
	success: false,
	error,
	message,
});

/**
 * Runs the Better Auth admin impersonate-user workflow as an Effect pipeline.
 *
 * @description Invokes the admin impersonation endpoint with structured logging and
 * normalizes the response into an adapter-friendly shape.
 *
 * @fp-pattern Curried dependency injector returning an Effect computation.
 * @composition
 *   - `pipe(Effect.sync(console.log), Effect.flatMap(Effect.tryPromise), Effect.flatMap(...))`
 *
 * @param dependencies - Functions required to reach the Better Auth admin API.
 * @returns {Effect.Effect<AdapterResponse<AdminUserSession>, never, never>} Effect resolving to a
 * normalized adapter response describing the impersonation action.
 *
 * @example
 * const effect = impersonateUser({ impersonateUserApi })(payload, { headers });
 * const response = await Effect.runPromise(effect);
 */
export const impersonateUser =
	(dependencies: ImpersonateUserDependencies) =>
	(
		options: ImpersonateUserOptions,
		context: AdapterContext
	): Effect.Effect<AdapterResponse<AdminUserSession>> => {
		const { impersonateUserApi } = dependencies;

		return pipe(
			Effect.sync(() => console.log('Impersonating Better Auth user:', options.userId)),
			Effect.flatMap(() =>
				Effect.tryPromise({
					try: () =>
						impersonateUserApi({
							...options,
							headers: context.headers,
						}),
					catch: (error) =>
						new ImpersonateUserRequestError('Failed to call admin impersonateUser API', error),
				})
			),
			Effect.flatMap((result) => {
				if (result.error) {
					return pipe(
						Effect.sync(() =>
							console.error('Admin impersonateUser API returned an error.', result.error)
						),
						Effect.map(() =>
							createFailureResponse(result.error, 'Failed to impersonate Better Auth user')
						)
					);
				}

				if (!result.data) {
					return pipe(
						Effect.sync(() => console.warn('Admin impersonateUser API returned no session payload.')),
						Effect.map(() =>
							createFailureResponse(
								undefined,
								'Better Auth impersonateUser API did not return a session payload'
							)
						)
					);
				}

				const session = result.data;

				return pipe(
					Effect.sync(() =>
						console.log('Impersonated Better Auth session:', {
							userId: session.session.userId,
							sessionId: session.session.id,
						})
					),
					Effect.map(() => createSuccessResponse(session))
				);
			}),
			Effect.catchAll((error) =>
				pipe(
					Effect.sync(() =>
						console.error('Unexpected error during admin impersonateUser pipeline.', error)
					),
					Effect.map(() =>
						createFailureResponse(
							error,
							error instanceof Error
								? error.message
								: 'Unexpected error while impersonating Better Auth user'
						)
					)
				)
			)
		);
	};
