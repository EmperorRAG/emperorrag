import { z } from 'zod';

/**
 * Zod schema for validating SignOutInput payloads.
 *
 * @description Validates the optional parameters for sign-out operation,
 * including callbackURL and fetchOptions for redirect and callback handling.
 *
 * @example
 * ```typescript
 * const result = signOutInputSchema.safeParse({
 *   callbackURL: 'https://example.com/login'
 * });
 *
 * if (result.success) {
 *   console.log('Valid input:', result.data);
 * }
 * ```
 */
export const signOutInputSchema = z
	.object({
		callbackURL: z.string().url('Invalid callback URL').optional(),
		fetchOptions: z
			.object({
				onSuccess: z.function().optional(),
				onError: z.function().optional(),
			})
			.optional(),
	})
	.optional();
