import { z } from "zod";

/**
 * Zod schema for validating ChangePasswordInput payloads.
 *
 * @description Validates the input for changing password, including required newPassword and currentPassword fields,
 * optional revokeOtherSessions flag, and optional fetchOptions for callback handling.
 *
 * @example
 * ```typescript
 * const result = changePasswordInputSchema.safeParse({
 *   newPassword: 'newSecurePassword123',
 *   currentPassword: 'oldPassword123',
 *   revokeOtherSessions: true
 * });
 *
 * if (result.success) {
 *   console.log('Valid input:', result.data);
 * }
 * ```
 */
export const changePasswordInputSchema = z.object({
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  currentPassword: z.string().min(1, "Current password is required"),
  revokeOtherSessions: z.boolean().optional(),
  fetchOptions: z
    .object({
      onSuccess: z.function().optional(),
      onError: z.function().optional(),
    })
    .optional(),
});
