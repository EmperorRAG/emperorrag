import { z } from "zod";

/**
 * Schema for list accounts input.
 *
 * @description Validates the input for the listAccounts operation.
 */
export const listAccountsSchema = z.object({
  headers: z.record(z.string(), z.string()).optional(),
});

export type ListAccountsSchema = z.infer<typeof listAccountsSchema>;
