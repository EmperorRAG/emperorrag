/**
 * @file libs/better-auth-utilities/src/lib/pipeline/error-handler/errorHandler.ts
 * @description Reusable error handler workflow pipeline for server-side operations.
 */

import * as Cause from 'effect/Cause';
import * as Effect from 'effect/Effect';
import { type AuthServerError } from '../../errors/authServer.error';
import { createUnknownErrorDescriptor, describeError } from '../describe-error/describeError';
import { isAuthServerErrorDescriptor } from '../describe-error/describeError.types';
import type { WithServerErrorHandlerProps as HandleErrorProps } from './handleError.types';

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
export const handleError: HandleErrorProps = <A, E, R>(effect: Effect.Effect<A, E, R>) => {
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
