import { z } from 'zod';

/**
 * Zod schema for validating UpdateUserServerParams.
 *
 * @description Validates the parameters for the updateUser server operation.
 */
export const updateUserServerParamsSchema = z.object({
	body: z.object({
		name: z.string().optional(),
		image: z.string().url().optional(),
	}),
	headers: z.instanceof(Headers).optional(),
	asResponse: z.boolean().optional(),
	returnHeaders: z.boolean().optional(),
});
