import { z } from 'zod';

/**
 * Zod schema for validating UpdateUserInput payloads.
 *
 * @description Validates the input for updating user details.
 * Note: The actual fields depend on the Better Auth configuration and plugins.
 * This schema provides a baseline validation.
 */
export const updateUserSchema = z.object({
	name: z.string().optional(),
	image: z.string().url().optional(),
	fetchOptions: z
		.object({
			onSuccess: z.function().optional(),
			onError: z.function().optional(),
		})
		.optional(),
});
