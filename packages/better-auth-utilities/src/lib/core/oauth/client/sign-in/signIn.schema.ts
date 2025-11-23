import { z } from 'zod';

/**
 * Zod schema for validating SignInSocialInput.
 *
 * @description Validates the input parameters for the signIn social operation.
 * Requires a provider and optional callbackURL/errorURL.
 */
export const signInSocialSchema = z.object({
	provider: z.enum(['github', 'google', 'apple', 'discord', 'facebook', 'microsoft', 'spotify', 'twitch', 'twitter']), // Add more as needed or use string()
	callbackURL: z.string().optional(),
	errorCallbackURL: z.string().optional(),
	newUserCallbackURL: z.string().optional(),
	disableRedirect: z.boolean().optional(),
});
