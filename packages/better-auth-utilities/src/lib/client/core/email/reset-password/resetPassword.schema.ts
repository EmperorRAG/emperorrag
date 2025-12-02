import { z } from 'zod';

/**
 * Zod schema for validating ResetPasswordInput payloads.
 *
 * @description Validates the input for resetting password, including required newPassword field,
 * optional token/code for verification, and optional callbackURL and fetchOptions.
 *
 * @example
 * ```typescript
 * const result = resetPasswordInputSchema.safeParse({
 *   newPassword: 'newSecurePassword123',
 *   token: 'verification-token-abc123',
 *   callbackURL: 'https://example.com/login'
 * });
 *
 * if (result.success) {
 *   console.log('Valid input:', result.data);
 * }
 * ```
 */
export const resetPasswordInputSchema = z.object({
	newPassword: z.string().min(8, 'Password must be at least 8 characters'),
	token: z.string().optional(),
	callbackURL: z.string().url('Invalid callback URL').optional(),
	fetchOptions: z
		.object({
			onSuccess: z.function().optional(),
			onError: z.function().optional(),
		})
		.optional(),
});
