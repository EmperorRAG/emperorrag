/**
 * @file libs/better-auth-utilities/src/lib/pipeline/error-handler/errorHandler.ts
 * @description Reusable error handler workflow pipeline for server-side operations.
 */

import * as Cause from 'effect/Cause';
import * as Effect from 'effect/Effect';
import type { AuthServerErrorDescriptor } from '../../errors/authServer.error';
import { AuthServerApiError, type AuthServerError } from '../../errors/authServer.error';
import { describeError } from '../describe-error/describeError';

/**
 * Standardized server error handler pipeline.
 *
 * @pure
 * @description A functional pipeline that intercepts errors from server workflows.
 * It transforms known domain errors (AuthServerError) into standardized descriptors
 * and catches unexpected defects (crashes), converting them into a generic 500 error descriptor.
 *
 * This ensures that all failures leaving the domain layer are structured, predictable,
 * and safe for consumption by the API layer (e.g., NestJS controllers).
 *
 * @param effect - The effect to wrap with error handling.
 * @returns An effect that fails with a standardized AuthServerErrorDescriptor.
 */
export const withServerErrorHandler = <A, E, R>(effect: Effect.Effect<A, E, R>): Effect.Effect<A, AuthServerErrorDescriptor, R> => {
	return effect.pipe(
		Effect.catchAllCause((cause) => {
			// If it's a failure (expected error E)
			if (Cause.isFailType(cause)) {
				const error = cause.error;

				// Handle known domain errors by mapping them to descriptors
				if (typeof error === 'object' && error !== null && '_tag' in error) {
					const tag = (error as { _tag: string })._tag;
					switch (tag) {
						case 'AuthServerDependenciesError':
						case 'AuthServerInputError':
						case 'AuthServerApiError':
						case 'AuthServerDataMissingError':
						case 'AuthServerSessionError':
							return Effect.fail(describeError(error as unknown as AuthServerError));
					}
				}

				// If it's already a descriptor (re-thrown), pass it through
				if (isAuthServerErrorDescriptor(error)) {
					return Effect.fail(error);
				}

				// Otherwise treat as unknown expected error
				return Effect.fail(createUnknownErrorDescriptor(error));
			}

			// If it's a defect (throw/die), log it and return generic 500
			const defect = Cause.squash(cause);
			return Effect.fail(createUnknownErrorDescriptor(defect));
		})
	);
};

/**
 * Type guard to check if an error is already a descriptor.
 */
const isAuthServerErrorDescriptor = (error: unknown): error is AuthServerErrorDescriptor => {
	return typeof error === 'object' && error !== null && '_tag' in error && (error as AuthServerErrorDescriptor)._tag === 'AuthServerErrorDescriptor';
};

/**
 * Helper to create a generic 500 error descriptor for unknown errors.
 */
const createUnknownErrorDescriptor = (cause: unknown): AuthServerErrorDescriptor => {
	const error = new AuthServerApiError('An unexpected error occurred', 500, cause);
	return {
		_tag: 'AuthServerErrorDescriptor',
		authServerErrorType: error,
		code: 'auth_server_error',
		message: error.message,
		status: 500,
		cause,
	};
};
