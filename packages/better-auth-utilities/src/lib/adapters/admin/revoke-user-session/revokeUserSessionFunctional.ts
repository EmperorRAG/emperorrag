import { Effect, pipe } from 'effect';
import {
	AdapterContext,
	AdapterResponse,
	RevokeUserSessionDependencies,
	RevokeUserSessionOptions,
	RevokeUserSessionResult,
} from '../../../types/admin/admin.types.js';

class RevokeUserSessionRequestError extends Error {
	readonly _tag = 'RevokeUserSessionRequestError';
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.cause = cause;
	}
}

const createSuccessResponse = (
	result: RevokeUserSessionResult
): AdapterResponse<RevokeUserSessionResult> => ({
	success: true,
	data: result,
	message: 'User session revoked successfully',
});

const createFailureResponse = (
	error: unknown,
	message: string
): AdapterResponse<RevokeUserSessionResult> => ({
	success: false,
	error,
	message,
});

/**
 * Runs the Better Auth admin revoke-user-session workflow via Effect-TS.
 *
 * @description Performs structured logging and response normalization around the admin
 * revokeUserSession endpoint.
 *
 * @fp-pattern Curried dependency injector returning an Effect computation.
 * @composition
 *   - `pipe(Effect.sync(console.log), Effect.flatMap(Effect.tryPromise), Effect.flatMap(...))`
 *
 * @param dependencies - Functions required to reach the Better Auth admin API.
 * @returns {Effect.Effect<AdapterResponse<RevokeUserSessionResult>, never, never>} Effect resolving to a
 * normalized adapter response describing the revoke action.
 *
 * @example
 * const effect = revokeUserSession({ revokeUserSessionApi })(payload, { headers });
 * const response = await Effect.runPromise(effect);
 */
export const revokeUserSession =
	(dependencies: RevokeUserSessionDependencies) =>
	(
		options: RevokeUserSessionOptions,
		context: AdapterContext
	): Effect.Effect<AdapterResponse<RevokeUserSessionResult>> => {
		const { revokeUserSessionApi } = dependencies;

		return pipe(
			Effect.sync(() => console.log('Revoking Better Auth session:', options.sessionId)),
			Effect.flatMap(() =>
				Effect.tryPromise({
					try: () =>
						revokeUserSessionApi({
							...options,
							headers: context.headers,
						}),
					catch: (error) =>
						new RevokeUserSessionRequestError('Failed to call admin revokeUserSession API', error),
				})
			),
			Effect.flatMap((result) => {
				if (result.error) {
					return pipe(
						Effect.sync(() =>
							console.error('Admin revokeUserSession API returned an error.', result.error)
						),
						Effect.map(() =>
							createFailureResponse(result.error, 'Failed to revoke Better Auth user session')
						)
					);
				}

				const payload = result.data ?? { success: false };

				if (!payload.success) {
					return pipe(
						Effect.sync(() => console.warn('Admin revokeUserSession API reported failure state.')),
						Effect.map(() =>
							createFailureResponse(
								payload,
								'Better Auth revokeUserSession API reported unsuccessful revocation'
							)
						)
					);
				}

				return pipe(
					Effect.sync(() => console.log('Revoked Better Auth session:', options.sessionId)),
					Effect.map(() => createSuccessResponse(payload))
				);
			}),
			Effect.catchAll((error) =>
				pipe(
					Effect.sync(() =>
						console.error('Unexpected error during admin revokeUserSession pipeline.', error)
					),
					Effect.map(() =>
						createFailureResponse(
							error,
							error instanceof Error
								? error.message
								: 'Unexpected error while revoking Better Auth session'
						)
					)
				)
			)
		);
	};
