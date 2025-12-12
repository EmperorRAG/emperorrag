import type * as Effect from 'effect/Effect';
import type { z } from 'zod';

export interface FormatZodErrorMessageProps {
	(error: z.ZodError): Effect.Effect<string>;
}
