import { z } from 'zod';

/**
 * Zod schema for validating SignUpEmailInput payloads.
 *
 * @description Validates the credentials object for email sign-up, including required fields
 * (name, email, password) and optional fields (image, callbackURL, fetchOptions).
 *
 * @example
 * ```typescript
 * const result = signUpEmailInputSchema.safeParse({
 *   name: 'John Doe',
 *   email: 'user@example.com',
 *   password: 'securePassword123',
 *   image: 'https://example.com/avatar.jpg'
 * });
 *
 * if (result.success) {
 *   console.log('Valid input:', result.data);
 * }
 * ```
 */
export const signUpEmailInputSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email format'),
	password: z.string().min(1, 'Password is required'),
	image: z.string().url('Invalid image URL').optional(),
	callbackURL: z.string().url('Invalid callback URL').optional(),
	fetchOptions: z
		.object({
			onSuccess: z.function().optional(),
			onError: z.function().optional(),
		})
		.optional(),
});
