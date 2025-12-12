import * as Effect from 'effect/Effect';
import { pipe } from 'effect/Function';
import * as Match from 'effect/Match';
import type { AuthServerApiEndpoints } from '../../enums/authServerApiEndpoints.enum';
import { type OperationCodes } from '../../enums/operationCodes.enum';
import { type CoreAuthServerInputError, isZodError } from '../../server/core/shared/core.error';
import { createAuthServerInputError } from '../create-auth-server-input-error/createAuthServerInputError';
import { formatZodErrorMessage } from '../format-zod-error-message/formatZodErrorMessage';
import { type CoreInputValidationDetails } from './mapInputError.types';

/**
 * Maps input validation errors to CoreAuthServerInputError with full traceability.
 *
 * @pure
 * @description Converts various input validation error types (ZodError, type guard failures,
 * schema creation errors) into a standardized CoreAuthServerInputError with detailed
 * traceability information about where in the workflow the error occurred.
 */

export const mapInputError = (error: unknown, operationCode: OperationCodes, endpoint: AuthServerApiEndpoints): Effect.Effect<CoreAuthServerInputError> => {
	const details: CoreInputValidationDetails = {
		operationCode: operationCode,
		endpoint: endpoint,
	};

	return Match.value(error).pipe(
		Match.when(isZodError, (err) => {
			const fieldErrors = err.issues.map((issue) => ({
				path: issue.path.join('.'),
				message: issue.message,
			}));

			const detailsWithFields: CoreInputValidationDetails = {
				...details,
				fieldErrors,
			};

			return pipe(
				formatZodErrorMessage(err),
				Effect.flatMap((message) => createAuthServerInputError(message, { zodError: err, details: detailsWithFields }))
			);
		}),
		Match.when(Match.instanceOf(Error), (err) => createAuthServerInputError(err.message, { originalError: err, details })),
		Match.orElse((err) => {
			const message = `Invalid ${endpoint} parameters: ${operationCode} failed`;
			return createAuthServerInputError(message, { originalError: err, details });
		})
	);
};
