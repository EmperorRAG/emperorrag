import { Effect } from 'effect';
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
import {
	EmailAuthDependenciesError,
	EmailAuthInputError,
	EmailAuthApiError,
	EmailAuthDataMissingError,
	EmailAuthSessionError,
} from './email.error.js';
import type { AuthClient, AuthClientSessionOf, AuthClientSessionUserOf, AuthClientSessionUserSessionOf } from '../../../client.js';

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

/**
 * Signs up a new user via email authentication.
 *
 * @description Validates dependencies and input, calls Better Auth sign-up API,
 * resolves session, and returns the authenticated user with session.
 *
 * @fp-pattern Curried dependency injection with Effect-based error handling
 * @composition Effect.gen with sequential validation and API calls
 *
 * @param deps - Email auth client dependencies (auth client, logger, telemetry)
 * @returns {Effect.Effect<SignUpEmailResult, EmailAuthError>} Effect that resolves
 * with authenticated user/session or fails with typed error.
 *
 * @example
 * ```typescript
 * const program = signUpEmail(deps)({ email: 'user@example.com', password: 'secret', name: 'User' });
 * const result = await Effect.runPromise(program);
 * ```
 */
export const signUpEmail: signUpEmailProps<AuthClient> = (deps) => (input) =>
	Effect.gen(function* () {
		// Validate dependencies structure
		if (!isEmailAuthClientDeps<AuthClient>(deps)) {
			return yield* Effect.fail(
				new EmailAuthDependenciesError('Invalid dependencies provided to signUpEmail')
			);
		}

		// Validate input payload structure
		if (!isSignUpEmailInput(input)) {
			return yield* Effect.fail(
				new EmailAuthInputError('Invalid sign up payload')
			);
		}

		const { authClient, logger, telemetry, featureFlags } = deps;

		// Execute Better Auth sign-up API call
		const signUpResponse = yield* Effect.tryPromise({
			try: () =>
				authClient.signUp.email({
					name: input.name,
					email: input.email,
					password: input.password,
					image: input.image,
					callbackURL: input.callbackUrl,
				}),
			catch: (error) => new EmailAuthApiError('Sign up API call failed', undefined, error),
		});

		// Cast to Better Fetch response union type
		const response = signUpResponse as FetchResponse<
			SignUpSuccessPayload<AuthClient>,
			SignUpErrorPayload
		>;

		// Handle Better Fetch error response
		if (isFetchFailure(response)) {
			logger?.error('signUpEmail failed', { error: response.error });
			void telemetry?.trackEvent('signUpEmail.failed', {
				errorStatus: response.error.status,
				errorMessage: response.error.message,
				featureFlags,
			});
			return yield* Effect.fail(
				new EmailAuthApiError('Sign up failed', response.error.status, response.error)
			);
		}

		// Extract user and session from successful response
		const { user: userPayload, session: sessionFromResponse = null } = response.data;

		// Validate required user payload exists
		if (!userPayload) {
			const error = new EmailAuthDataMissingError('Sign up response is missing user payload');
			logger?.error('signUpEmail failed', { error });
			void telemetry?.trackEvent('signUpEmail.failed', {
				errorMessage: error.message,
				featureFlags,
			});
			return yield* Effect.fail(error);
		}

		let resolvedSession: AuthClientSessionUserSessionOf<AuthClient> | null = sessionFromResponse ?? null;

		// Fallback session retrieval when sign-up response lacks session data
		if (!resolvedSession) {
			const sessionResult = yield* Effect.tryPromise({
				try: () => authClient.getSession(),
				catch: (error) => new EmailAuthSessionError('Failed to fetch session', error),
			});

			const sessionResponse = sessionResult as FetchResponse<
				AuthClientSessionOf<AuthClient> | null,
				SignUpErrorPayload
			>;

			// Handle session fetch failure gracefully (warn but continue to final validation)
			if (isFetchFailure(sessionResponse)) {
				logger?.warn('signUpEmail session fetch failed', { error: sessionResponse.error });
				void telemetry?.trackEvent('signUpEmail.sessionFetchFailed', {
					errorStatus: sessionResponse.error.status,
					errorMessage: sessionResponse.error.message,
					featureFlags,
				});
			} else {
				// Extract session from successful getSession response
				resolvedSession = sessionResponse.data?.session ?? null;
			}
		}

		// Final validation that session was successfully resolved
		if (!resolvedSession) {
			const error = new EmailAuthSessionError('Unable to resolve session after sign up');
			logger?.error('signUpEmail failed', { error });
			void telemetry?.trackEvent('signUpEmail.failed', {
				errorMessage: error.message,
				featureFlags,
			});
			return yield* Effect.fail(error);
		}

		// Log successful sign-up operation
		logger?.info('signUpEmail succeeded', {
			userId: userPayload.id,
			sessionId: resolvedSession.id,
		});

		// Track successful sign-up analytics event
		void telemetry?.trackEvent('signUpEmail.success', {
			userId: userPayload.id,
			featureFlags,
		});

		// Return successful sign-up result
		return {
			user: userPayload,
			session: resolvedSession,
			callbackUrl: input.callbackUrl,
		};
	});

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
