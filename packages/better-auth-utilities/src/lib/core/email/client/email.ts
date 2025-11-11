import type { signUpEmailProps } from './email.types.js';
import type { AuthClient } from '../../../client.js';

export const signUpEmail: signUpEmailProps<AuthClient> =
	({ authClient }) =>
	async ({ name, email, password, image, callbackUrl }) => {
		// Implementation for signing up a user via email goes here.
		void authClient;
		void name;
		void email;
		void password;
		void image;
		void callbackUrl;
		throw new Error('Not implemented');
	};
