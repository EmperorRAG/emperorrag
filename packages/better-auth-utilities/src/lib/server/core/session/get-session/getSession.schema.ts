import { z } from 'zod';

/**
 * Zod schema for validating GetSessionServerInput.
 *
 * @description Validates the input parameters for the getSession server operation.
 * The server-side getSession typically requires headers or a request object.
 */
export const getSessionServerSchema = z.object({
	headers: z.instanceof(Headers).optional(),
	body: z.any().optional(),
	query: z.any().optional(),
	asResponse: z.boolean().optional(),
});
