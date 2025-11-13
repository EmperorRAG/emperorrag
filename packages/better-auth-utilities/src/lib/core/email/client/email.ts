import { Effect } from 'effect';
import type {
	changePasswordProps,
	requestPasswordResetProps,
	sendVerificationEmailProps,
	signInEmailProps,
	signOutProps,
	resetPasswordProps,
} from './email.types.js';
import {
	EmailAuthInputError,
} from './email.error.js';
import type { AuthClient} from '../../../client.js';

export const signInEmail: signInEmailProps<AuthClient> =
	({ authClient }) =>
	({ email, password, rememberMe, callbackUrl }) => {
		void authClient;
		void email;
		void password;
		void rememberMe;
		void callbackUrl;
		return Effect.fail(new EmailAuthInputError('Not implemented'));
	};

export const signOut: signOutProps<AuthClient> =
	({ authClient }) =>
	(options) => {
		void authClient;
		void options;
		return Effect.fail(new EmailAuthInputError('Not implemented'));
	};

export const sendVerificationEmail: sendVerificationEmailProps =
	({ authClient }) =>
	({ email, callbackUrl }) => {
		void authClient;
		void email;
		void callbackUrl;
		return Effect.fail(new EmailAuthInputError('Not implemented'));
	};

export const requestPasswordReset: requestPasswordResetProps =
	({ authClient }) =>
	({ email, redirectTo }) => {
		void authClient;
		void email;
		void redirectTo;
		return Effect.fail(new EmailAuthInputError('Not implemented'));
	};

export const resetPassword: resetPasswordProps =
	({ authClient }) =>
	({ newPassword, token }) => {
		void authClient;
		void newPassword;
		void token;
		return Effect.fail(new EmailAuthInputError('Not implemented'));
	};

export const changePassword: changePasswordProps =
	({ authClient }) =>
	({ newPassword, currentPassword, revokeOtherSessions }) => {
		void authClient;
		void newPassword;
		void currentPassword;
		void revokeOtherSessions;
		return Effect.fail(new EmailAuthInputError('Not implemented'));
	};
