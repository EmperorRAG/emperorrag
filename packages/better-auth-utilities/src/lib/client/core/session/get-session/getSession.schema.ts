import { z } from "zod";

/**
 * Zod schema for validating GetSessionInput.
 *
 * @description Validates the input parameters for the getSession operation.
 * Since getSession mainly takes fetchOptions, we define a loose schema for it.
 */
export const getSessionSchema = z
  .object({
    fetchOptions: z
      .object({
        headers: z.record(z.string(), z.string()).optional(),
      })
      .optional(),
  })
  .optional();
