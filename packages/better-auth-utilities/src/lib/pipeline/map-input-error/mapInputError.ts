import { pipe } from 'effect/Function';
import * as Match from 'effect/Match';
import type { AuthServerApiEndpoints } from '../../enums/authServerApiEndpoints.enum';
import { type OperationCodes } from '../../enums/operationCodes.enum';
import { CoreAuthServerInputError, isZodError } from '../../server/core/shared/core.error';
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

export const mapBetterAuthInputErrorToCoreAuthError = (
	error: unknown,
	operationCode: OperationCodes,
	endpoint: AuthServerApiEndpoints
): CoreAuthServerInputError => {
	const details: CoreInputValidationDetails = {
		source: operationCode,
		operation: endpoint,
	};

	return pipe(
		Match.value(error),
		Match.when(isZodError, (err) => {
			const fieldErrors = err.issues.map((issue) => ({
				path: issue.path.join('.'),
				message: issue.message,
			}));

			const detailsWithFields: CoreInputValidationDetails = {
				...details,
				fieldErrors,
			};

			const message = formatZodErrorMessage(err, endpoint);
			return new CoreAuthServerInputError(message, { zodError: err, details: detailsWithFields });
		}),
		Match.when(Match.instanceOf(Error), (err) => new CoreAuthServerInputError(err.message, { originalError: err, details })),
		Match.orElse((err) => {
			const message = `Invalid ${endpoint} parameters: ${operationCode} failed`;
			return new CoreAuthServerInputError(message, { originalError: err, details });
		})
	);
};
