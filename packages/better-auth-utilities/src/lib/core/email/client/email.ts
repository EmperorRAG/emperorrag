import type {
	changePasswordProps,
	requestPasswordResetProps,
	sendVerificationEmailProps,
	signInEmailProps,
	signOutProps,
	signUpEmailProps,
	resetPasswordProps,
} from './email.types.js';
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

export const signInEmail: signInEmailProps<AuthClient> =
	({ authClient }) =>
	async ({ email, password, rememberMe, callbackUrl }) => {
		void authClient;
		void email;
		void password;
		void rememberMe;
		void callbackUrl;
		throw new Error('Not implemented');
	};

export const signOut: signOutProps<AuthClient> =
	({ authClient }) =>
	async (options) => {
		void authClient;
		void options;
		throw new Error('Not implemented');
	};

export const sendVerificationEmail: sendVerificationEmailProps =
	({ authClient }) =>
	async ({ email, callbackUrl }) => {
		void authClient;
		void email;
		void callbackUrl;
		throw new Error('Not implemented');
	};

export const requestPasswordReset: requestPasswordResetProps =
	({ authClient }) =>
	async ({ email, redirectTo }) => {
		void authClient;
		void email;
		void redirectTo;
		throw new Error('Not implemented');
	};

export const resetPassword: resetPasswordProps =
	({ authClient }) =>
	async ({ newPassword, token }) => {
		void authClient;
		void newPassword;
		void token;
		throw new Error('Not implemented');
	};

export const changePassword: changePasswordProps =
	({ authClient }) =>
	async ({ newPassword, currentPassword, revokeOtherSessions }) => {
		void authClient;
		void newPassword;
		void currentPassword;
		void revokeOtherSessions;
		throw new Error('Not implemented');
	};
