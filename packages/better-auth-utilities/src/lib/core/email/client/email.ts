import type { BetterFetchError } from '@better-fetch/fetch';
import type {
	changePasswordProps,
	requestPasswordResetProps,
	sendVerificationEmailProps,
	signInEmailProps,
	signOutProps,
	signUpEmailProps,
	resetPasswordProps,
} from './email.types.js';
import { isEmailAuthClientDeps, isSignUpEmailInput } from './email.types.js';
import type { AuthClient, AuthClientSessionOf, AuthClientSessionUserOf, AuthClientSessionUserSessionOf } from '../../../client.js';

const invalidDependenciesError = new Error('Invalid dependencies provided to signUpEmail');
const invalidInputError = new Error('Invalid sign up payload');

type FetchSuccess<TData> = Readonly<{ data: TData; error: null }>;
type FetchFailure<TError> = Readonly<{ data: null; error: TError }>;
type FetchResponse<TData, TError> = FetchSuccess<TData> | FetchFailure<TError>;

type SignUpSuccessPayload<TAuthClient extends AuthClient> = Readonly<{
	user: AuthClientSessionUserOf<TAuthClient>;
	session?: AuthClientSessionUserSessionOf<TAuthClient> | null;
	token?: string | null;
}>;

type SignUpErrorPayload = BetterFetchError & Readonly<Record<string, unknown>>;

const isFetchFailure = <TData, TError>(response: FetchResponse<TData, TError>): response is FetchFailure<TError> => response.error !== null;

const createMissingDataError = (message: string, cause?: unknown): Error => Object.assign(new Error(message), { cause });

export const signUpEmail: signUpEmailProps<AuthClient> = (deps) => async (input) => {
	if (!isEmailAuthClientDeps<AuthClient>(deps)) {
		throw invalidDependenciesError;
	}

	if (!isSignUpEmailInput(input)) {
		throw invalidInputError;
	}

	const { authClient, logger, telemetry, featureFlags } = deps;

	try {
		const signUpResponse = (await authClient.signUp.email({
			name: input.name,
			email: input.email,
			password: input.password,
			image: input.image,
			callbackURL: input.callbackUrl,
		})) as FetchResponse<SignUpSuccessPayload<AuthClient>, SignUpErrorPayload>;

		if (isFetchFailure(signUpResponse)) {
			logger?.error('signUpEmail failed', { error: signUpResponse.error });
			void telemetry?.trackEvent('signUpEmail.failed', {
				errorStatus: signUpResponse.error.status,
				errorMessage: signUpResponse.error.message,
				featureFlags,
			});
			throw signUpResponse.error;
		}

		const { user: userPayload, session: sessionFromResponse = null } = signUpResponse.data;

		if (!userPayload) {
			const missingUserError = createMissingDataError('Sign up response is missing user payload');
			logger?.error('signUpEmail failed', { error: missingUserError });
			void telemetry?.trackEvent('signUpEmail.failed', {
				errorMessage: missingUserError.message,
				featureFlags,
			});
			throw missingUserError;
		}

		let resolvedSession: AuthClientSessionUserSessionOf<AuthClient> | null = sessionFromResponse ?? null;

		if (!resolvedSession) {
			const sessionResponse = (await authClient.getSession()) as FetchResponse<AuthClientSessionOf<AuthClient> | null, SignUpErrorPayload>;

			if (isFetchFailure(sessionResponse)) {
				logger?.warn('signUpEmail session fetch failed', { error: sessionResponse.error });
				void telemetry?.trackEvent('signUpEmail.sessionFetchFailed', {
					errorStatus: sessionResponse.error.status,
					errorMessage: sessionResponse.error.message,
					featureFlags,
				});
			} else {
				resolvedSession = sessionResponse.data?.session ?? null;
			}
		}

		if (!resolvedSession) {
			const sessionMissingError = createMissingDataError('Unable to resolve session after sign up');
			logger?.error('signUpEmail failed', { error: sessionMissingError });
			void telemetry?.trackEvent('signUpEmail.failed', {
				errorMessage: sessionMissingError.message,
				featureFlags,
			});
			throw sessionMissingError;
		}

		logger?.info('signUpEmail succeeded', {
			userId: userPayload.id,
			sessionId: resolvedSession.id,
		});

		void telemetry?.trackEvent('signUpEmail.success', {
			userId: userPayload.id,
			featureFlags,
		});

		return {
			user: userPayload,
			session: resolvedSession,
			callbackUrl: input.callbackUrl,
		};
	} catch (error) {
		logger?.error('signUpEmail failed', { error });
		throw error;
	}
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
