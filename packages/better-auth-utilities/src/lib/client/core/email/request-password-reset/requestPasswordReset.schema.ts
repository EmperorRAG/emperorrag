import { z } from "zod";

/**
 * Zod schema for validating RequestPasswordResetInput payloads.
 *
 * @description Validates the input for requesting a password reset, including required email field
 * and optional redirectTo, callbackURL, and fetchOptions for redirect and callback handling.
 *
 * @example
 * ```typescript
 * const result = requestPasswordResetInputSchema.safeParse({
 *   email: 'user@example.com',
 *   redirectTo: 'https://example.com/reset-password',
 *   callbackURL: 'https://example.com/reset-complete'
 * });
 *
 * if (result.success) {
 *   console.log('Valid input:', result.data);
 * }
 * ```
 */
export const requestPasswordResetInputSchema = z.object({
  email: z.string().email("Invalid email format"),
  redirectTo: z.string().url("Invalid redirect URL").optional(),
  callbackURL: z.string().url("Invalid callback URL").optional(),
  fetchOptions: z
    .object({
      onSuccess: z.function().optional(),
      onError: z.function().optional(),
    })
    .optional(),
});
