import * as Array from 'effect/Array';
import * as Effect from 'effect/Effect';
import { pipe } from 'effect/Function';
import * as Match from 'effect/Match';
import { PipelineContext } from '../../context/pipeline.context';
import { createAuthServerInputError } from '../create-auth-server-input-error/createAuthServerInputError';
import { formatZodErrorMessage } from '../format-zod-error-message/formatZodErrorMessage';
import { isZodError } from '../is-zod-error/isZodError';
import type { MapInputErrorProps } from './mapInputError.types';

/**
 * Maps input validation errors to AuthServerInputError with full traceability.
 *
 * @pure
 * @description Converts various input validation error types (ZodError, type guard failures,
 * schema creation errors) into a standardized AuthServerInputError with detailed
 * traceability information about where in the workflow the error occurred.
 */

export const mapInputError: MapInputErrorProps = (error) =>
	Effect.gen(function* () {
		const { operationCode, endpoint } = yield* PipelineContext;
		if (!operationCode) {
			return yield* Effect.dieMessage('Operation code is required in PipelineContext for mapInputError');
		}

		return yield* Match.value(error).pipe(
			Match.when(isZodError, (err) =>
				pipe(
					formatZodErrorMessage(err),
					Effect.flatMap((message) =>
						createAuthServerInputError(message, {
							zodError: err,
							details: {
								operationCode,
								endpoint,
								fieldErrors: pipe(
									err.issues,
									Array.map((issue) => ({
										path: pipe(issue.path, Array.map(String), Array.join('.')),
										message: issue.message,
									}))
								),
							},
						})
					)
				)
			),
			Match.when(Match.instanceOf(Error), (err) =>
				createAuthServerInputError(err.message, {
					originalError: err,
					details: { operationCode, endpoint },
				})
			),
			Match.orElse((err) =>
				createAuthServerInputError(`Invalid ${endpoint} parameters: ${operationCode._tag} failed`, {
					originalError: err,
					details: { operationCode, endpoint },
				})
			),
			Effect.flatMap(Effect.fail)
		);
	});
