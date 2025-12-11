import * as Effect from 'effect/Effect';
import type { z } from 'zod';

/**
 * Formats ZodError into a human-readable message.
 *
 * @pure
 * @description Creates a structured error message from ZodError field-level issues.
 */

export const formatZodErrorMessage = (error: z.ZodError) =>
	Effect.succeed(error.issues).pipe(
		Effect.map((issues) =>
			issues
				.map((issue) => {
					const path = issue.path.length > 0 ? issue.path.join('.') : 'input';
					return `${path}: ${issue.message}`;
				})
				.join('; ')
		),
		Effect.map((fieldMessages) => `Invalid parameters: ${fieldMessages}`)
	);
