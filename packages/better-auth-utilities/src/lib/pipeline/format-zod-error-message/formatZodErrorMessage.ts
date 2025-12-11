import * as Effect from 'effect/Effect';
import type { z } from 'zod';

/**
 * Formats ZodError into a human-readable message.
 *
 * @pure
 * @description Creates a structured error message from ZodError field-level issues.
 */

export const formatZodErrorMessage = (error: z.ZodError): Effect.Effect<string> => {
	const fieldMessages = error.issues
		.map((issue) => {
			const path = issue.path.length > 0 ? issue.path.join('.') : 'input';
			return `${path}: ${issue.message}`;
		})
		.join('; ');

	return Effect.succeed(`Invalid parameters: ${fieldMessages}`);
};
