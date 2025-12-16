import { z } from "zod";

/**
 * Zod schema for validating EmailAuthClientDeps dependencies.
 *
 * @description Validates the dependency bundle contains a valid authClient object.
 * The authClient must be an object (runtime validation cannot verify Better Auth client structure).
 * Shared across all email authentication operations.
 *
 * @example
 * ```typescript
 * const result = emailAuthClientDepsSchema.safeParse({
 *   authClient: myAuthClient
 * });
 *
 * if (result.success) {
 *   console.log('Valid dependencies:', result.data);
 * }
 * ```
 */
export const emailAuthClientDepsSchema = z.object({
  authClient: z.object({}).passthrough(),
});
