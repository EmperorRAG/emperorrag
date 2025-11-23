/**
 * @file libs/better-auth-utilities/src/lib/core/oauth/server/sign-in/signIn.schema.ts
 * @description Zod schemas for OAuth server sign-in operations.
 */

import { z } from 'zod';

/**
 * Schema for server-side social sign-in input.
 * Validates the structure expected by Better Auth server API.
 */
export const signInSocialServerSchema = z.object({
	body: z.object({
		provider: z.string(),
		callbackURL: z.string().optional(),
		errorCallbackURL: z.string().optional(),
		newUserCallbackURL: z.string().optional(),
		disableRedirect: z.boolean().optional(),
		idToken: z.string().optional(),
	}),
	headers: z.any().optional(),
});
