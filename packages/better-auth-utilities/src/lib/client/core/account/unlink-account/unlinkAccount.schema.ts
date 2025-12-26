import { z } from "zod";

/**
 * Schema for unlink account input.
 */
export const unlinkAccountSchema = z.object({
  providerId: z.string().min(1),
  headers: z.record(z.string(), z.string()).optional(),
});

export type UnlinkAccountSchema = z.infer<typeof unlinkAccountSchema>;
