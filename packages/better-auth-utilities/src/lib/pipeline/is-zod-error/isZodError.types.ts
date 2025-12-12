import type { z } from 'zod';

export interface IsZodErrorProps {
	(error: unknown): error is z.ZodError;
}
