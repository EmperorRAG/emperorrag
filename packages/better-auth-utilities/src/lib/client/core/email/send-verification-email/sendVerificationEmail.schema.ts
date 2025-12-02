import { z } from 'zod';

/**
 * Zod schema for validating SendVerificationEmailInput payloads.
 *
 * @description Validates the input for sending verification email, including required email field
 * and optional callbackURL and fetchOptions for redirect and callback handling.
 *
 * @example
 * ```typescript
 * const result = sendVerificationEmailInputSchema.safeParse({
 *   email: 'user@example.com',
 *   callbackURL: 'https://example.com/verify'
 * });
 *
 * if (result.success) {
 *   console.log('Valid input:', result.data);
 * }
 * ```
 */
export const sendVerificationEmailInputSchema = z.object({
	email: z.string().email('Invalid email format'),
	callbackURL: z.string().url('Invalid callback URL').optional(),
	fetchOptions: z
		.object({
			onSuccess: z.function().optional(),
			onError: z.function().optional(),
		})
		.optional(),
});
