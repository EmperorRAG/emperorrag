import { Effect } from 'effect';
import type { changePasswordProps, requestPasswordResetProps, resetPasswordProps } from '../email.types.js';
import { EmailAuthInputError } from './email.error.js';

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
