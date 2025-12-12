import * as Array from 'effect/Array';
import * as Effect from 'effect/Effect';
import { pipe } from 'effect/Function';
import type { FormatZodErrorMessageProps } from './formatZodErrorMessage.types';

/**
 * Formats ZodError into a human-readable message.
 *
 * @pure
 * @description Creates a structured error message from ZodError field-level issues.
 */

export const formatZodErrorMessage: FormatZodErrorMessageProps = (error) =>
	Effect.succeed(error.issues).pipe(
		Effect.map((issues) =>
			pipe(
				issues,
				Array.map((issue) => {
					const path = Array.isNonEmptyArray(issue.path) ? pipe(issue.path, Array.map(String), Array.join('.')) : 'input';
					return `${path}: ${issue.message}`;
				}),
				Array.join('; ')
			)
		),
		Effect.map((fieldMessages) => `Invalid parameters: ${fieldMessages}`),
		Effect.withSpan('formatZodErrorMessage')
	);
