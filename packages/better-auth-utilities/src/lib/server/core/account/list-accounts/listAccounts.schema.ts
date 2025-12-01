import { z } from 'zod';

/**
 * Zod schema for validating ListAccountsServerParams.
 *
 * @description Validates the parameters for the listAccounts server operation.
 * Since listAccounts typically requires no body, this schema focuses on optional configuration.
 */
export const listAccountsServerParamsSchema = z.object({
	body: z.any().optional(),
	headers: z.instanceof(Headers).optional(),
	asResponse: z.boolean().optional(),
	returnHeaders: z.boolean().optional(),
});
