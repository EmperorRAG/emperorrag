import { z } from 'zod';

/**
 * Zod schema for validating UnlinkAccountServerParams.
 *
 * @description Validates the parameters for the unlinkAccount server operation.
 */
export const unlinkAccountServerParamsSchema = z.object({
	body: z.object({
		providerId: z.string(),
	}),
	headers: z.instanceof(Headers).optional(),
	asResponse: z.boolean().optional(),
	returnHeaders: z.boolean().optional(),
});
