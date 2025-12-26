import { z } from "zod";

/**
 * Zod schema for validating SignInEmailInput payloads.
 *
 * @description Validates the credentials object for email sign-in, including required fields
 * (email, password) and optional fields (rememberMe, callbackURL, fetchOptions).
 *
 * @example
 * ```typescript
 * const result = signInEmailInputSchema.safeParse({
 *   email: 'user@example.com',
 *   password: 'securePassword123',
 *   rememberMe: true
 * });
 *
 * if (result.success) {
 *   console.log('Valid input:', result.data);
 * }
 * ```
 */
export const signInEmailInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
  callbackURL: z.string().url().optional(),
  fetchOptions: z
    .object({
      onSuccess: z.function().optional(),
      onError: z.function().optional(),
    })
    .optional(),
});
