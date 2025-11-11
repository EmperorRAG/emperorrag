import type { signUpEmailProps } from './email.types.js';
import type { AuthClient } from '../../../client.js';

export const signUpEmail: signUpEmailProps<AuthClient> = async ({ name, email, password, image, callbackUrl }) => {
	// Implementation for signing up a user via email goes here.
	throw new Error('Not implemented');
};
