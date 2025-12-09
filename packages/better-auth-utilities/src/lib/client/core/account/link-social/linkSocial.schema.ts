import { z } from 'zod';

/**
 * Schema for link social input.
 */
export const linkSocialSchema = z.object({
	provider: z.string().min(1),
	callbackURL: z.string().optional(),
	headers: z.record(z.string(), z.string()).optional(),
});

export type LinkSocialSchema = z.infer<typeof linkSocialSchema>;
