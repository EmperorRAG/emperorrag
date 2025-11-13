//import type { UserPureType } from '@emperorrag/prisma-better-auth-db/types';
/*
type EmailRequestType = {
	user: UserPureType;
	url: string;
	token: string;
};

export interface SignInProps {
	email: UserPureType['email'];
	password: string;
	rememberMe?: boolean;
	callbackUrl?: string;
}

export interface SignUpProps {
	name: UserPureType['name'];
	email: UserPureType['email'];
	password: string;
	image?: UserPureType['image'];
	callbackUrl?: string;
}

export interface SignOutFetchOptions {
	onSuccess?: () => void;
}

export interface SignOutProps {
	fetchOptions?: SignOutFetchOptions;
}

export interface sendVerificationEmailArgs {
	user: EmailRequestType['user'];
	url: EmailRequestType['url'];
	token: EmailRequestType['token'];
}

export interface sendResetPasswordArgs {
	user: EmailRequestType['user'];
	url: EmailRequestType['url'];
	token: EmailRequestType['token'];
}

export interface onPasswordResetArgs {
	user: EmailRequestType['user'];
}

export interface requestPasswordResetProps {
	email: UserPureType['email'];
	redirectTo?: string;
}

export interface resetPasswordProps {
	newPassword: string;
	token: string;
}

export interface ChangePasswordProps {
	newPassword: string;
	currentPassword: string;
	revokeOtherSessions?: boolean;
}

export interface EmailAndPasswordOptions {
	enabled?: boolean;
	disableSignUp?: boolean;
	minPasswordLength?: number;
	maxPasswordLength?: number;
	sendResetPassword?: (args: sendResetPasswordArgs, request: Request) => Promise<void>;
	onPasswordReset?: (args: onPasswordResetArgs, request: Request) => Promise<void>;
	resetPasswordTokenExpiresIn?: number;
	password?: Record<string, unknown>;
}
*/

import { Match, pipe, Effect } from 'effect';
import type { AuthClient, AuthClientSessionUserOf, AuthClientSessionUserSessionOf } from '../../../client.js';
import type { EmailAuthError } from './email.error.js';

export type SignUpEmailInput = {
	name: string;
	email: string;
	password: string;
	image?: string;
	callbackUrl?: string;
};

export type SignInEmailInput = {
	email: string;
	password: string;
	rememberMe?: boolean;
	callbackUrl?: string;
};

export type VerificationEmailInput = {
	email: string;
	callbackUrl?: string;
};

export type requestPasswordResetInput = {
	email: string;
	redirectTo?: string;
};

export type resetPasswordInput = {
	newPassword: string;
	token: string;
};

export type ChangePasswordInput = {
	newPassword: string;
	currentPassword: string;
	revokeOtherSessions?: boolean;
};

export type SignOutOptions = {
	all?: boolean;
	redirectTo?: string;
	fetchOptions?: Readonly<{
		onSuccess?: () => void | Promise<void>;
		onError?: (error: unknown) => void | Promise<void>;
	}>;
};

export type SignUpEmailResult<TAuthClient extends AuthClient> = {
	user: AuthClientSessionUserOf<TAuthClient>;
	session: AuthClientSessionUserSessionOf<TAuthClient>;
	callbackUrl?: string;
};

export type SignInEmailResult<TAuthClient extends AuthClient> = {
	user: AuthClientSessionUserOf<TAuthClient>;
	session: AuthClientSessionUserSessionOf<TAuthClient>;
	requiresVerification: boolean;
};

export type EmailAuthClientLogger = Readonly<{
	debug: (message: string, metadata?: Readonly<Record<string, unknown>>) => void;
	info: (message: string, metadata?: Readonly<Record<string, unknown>>) => void;
	warn: (message: string, metadata?: Readonly<Record<string, unknown>>) => void;
	error: (message: string, metadata?: Readonly<Record<string, unknown>>) => void;
}>;

export type EmailAuthClientTelemetry = Readonly<{
	trackEvent: (name: string, properties?: Readonly<Record<string, unknown>>) => void | Promise<void>;
}>;

export type EmailAuthClientFeatureFlags = Readonly<Record<string, boolean>>;

export type EmailAuthClientDeps<TAuthClient extends AuthClient = AuthClient> = Readonly<{
	authClient: TAuthClient;
	logger?: EmailAuthClientLogger;
	telemetry?: EmailAuthClientTelemetry;
	featureFlags?: EmailAuthClientFeatureFlags;
}>;

export type EmailAuthClientPreloaded<TAuthClient extends AuthClient = AuthClient> = Readonly<{
	signUpEmail: ReturnType<signUpEmailProps<TAuthClient>>;
	signInEmail: ReturnType<signInEmailProps<TAuthClient>>;
	signOut: ReturnType<signOutProps<TAuthClient>>;
	sendVerificationEmail: ReturnType<sendVerificationEmailProps>;
	requestPasswordReset: ReturnType<requestPasswordResetProps>;
	resetPassword: ReturnType<resetPasswordProps>;
	changePassword: ReturnType<changePasswordProps>;
}>;

export interface signUpEmailProps<TAuthClient extends AuthClient> {
	(deps: EmailAuthClientDeps<TAuthClient>): (input: SignUpEmailInput) => Effect.Effect<SignUpEmailResult<TAuthClient>, EmailAuthError>;
}
export interface signInEmailProps<TAuthClient extends AuthClient> {
	(deps: EmailAuthClientDeps<TAuthClient>): (input: SignInEmailInput) => Effect.Effect<SignInEmailResult<TAuthClient>, EmailAuthError>;
}
export interface signOutProps<TAuthClient extends AuthClient> {
	(deps: EmailAuthClientDeps<TAuthClient>): (options?: SignOutOptions) => Effect.Effect<void, EmailAuthError>;
}
export interface sendVerificationEmailProps {
	(deps: EmailAuthClientDeps): (input: VerificationEmailInput) => Effect.Effect<void, EmailAuthError>;
}
export interface requestPasswordResetProps {
	(deps: EmailAuthClientDeps): (input: requestPasswordResetInput) => Effect.Effect<void, EmailAuthError>;
}

export interface resetPasswordProps {
	(deps: EmailAuthClientDeps): (input: resetPasswordInput) => Effect.Effect<void, EmailAuthError>;
}
export interface changePasswordProps {
	(deps: EmailAuthClientDeps): (input: ChangePasswordInput) => Effect.Effect<void, EmailAuthError>;
}

const loggerKeys = ['debug', 'info', 'warn', 'error'] as const;
const telemetryKeys = ['trackEvent'] as const;
const emailAuthClientDepKeys = ['authClient', 'logger', 'telemetry', 'featureFlags'] as const;
const signUpKeys = ['name', 'email', 'password', 'image', 'callbackUrl'] as const;
const signInKeys = ['email', 'password', 'rememberMe', 'callbackUrl'] as const;
const signOutKeys = ['all', 'redirectTo', 'fetchOptions'] as const;
const signOutFetchOptionKeys = ['onSuccess', 'onError'] as const;
const verificationKeys = ['email', 'callbackUrl'] as const;
const requestResetKeys = ['email', 'redirectTo'] as const;
const resetPasswordKeys = ['newPassword', 'token'] as const;
const changePasswordKeys = ['newPassword', 'currentPassword', 'revokeOtherSessions'] as const;

type SignOutFetchOptions = NonNullable<SignOutOptions['fetchOptions']>;

const isUndefined = (value: unknown): value is undefined => value === undefined;

const hasOnlyKeys = (candidate: Record<string, unknown>, allowed: ReadonlyArray<string>): boolean =>
	pipe(Object.keys(candidate), (keys) => keys.every((key) => allowed.includes(key)));

const isRecord = (value: unknown): value is Record<string, unknown> =>
	pipe(
		value,
		Match.value,
		Match.when(
			(candidate: unknown): candidate is Record<string, unknown> => typeof candidate === 'object' && candidate !== null && !Array.isArray(candidate),
			() => true
		),
		Match.orElse(() => false)
	);

const isString = (value: unknown): value is string =>
	pipe(
		value,
		Match.value,
		Match.when(
			(candidate: unknown): candidate is string => typeof candidate === 'string',
			() => true
		),
		Match.orElse(() => false)
	);

const isNonEmptyString = (value: unknown): value is string =>
	pipe(
		value,
		Match.value,
		Match.when(isString, (candidate) => candidate.trim().length > 0),
		Match.orElse(() => false)
	);

const isOptionalString = (value: unknown): value is string | undefined =>
	pipe(
		value,
		Match.value,
		Match.when(isUndefined, () => true),
		Match.when(isString, () => true),
		Match.orElse(() => false)
	);

const isBoolean = (value: unknown): value is boolean =>
	pipe(
		value,
		Match.value,
		Match.when(
			(candidate: unknown): candidate is boolean => typeof candidate === 'boolean',
			() => true
		),
		Match.orElse(() => false)
	);

const isOptionalBoolean = (value: unknown): value is boolean | undefined =>
	pipe(
		value,
		Match.value,
		Match.when(isUndefined, () => true),
		Match.when(isBoolean, () => true),
		Match.orElse(() => false)
	);

const isFunction = (value: unknown): value is (...args: never[]) => unknown =>
	pipe(
		value,
		Match.value,
		Match.when(
			(candidate: unknown): candidate is (...args: never[]) => unknown => typeof candidate === 'function',
			() => true
		),
		Match.orElse(() => false)
	);

const isOptionalFunction = (value: unknown): value is ((...args: never[]) => unknown) | undefined =>
	pipe(
		value,
		Match.value,
		Match.when(isUndefined, () => true),
		Match.when(isFunction, () => true),
		Match.orElse(() => false)
	);

const isFeatureFlags = (value: unknown): value is EmailAuthClientFeatureFlags =>
	pipe(
		value,
		Match.value,
		Match.when(isRecord, (candidate: Record<string, unknown>) => pipe(Object.values(candidate), (entries) => entries.every((entry) => isBoolean(entry)))),
		Match.orElse(() => false)
	);

const isOptionalFeatureFlags = (value: unknown): value is EmailAuthClientFeatureFlags | undefined =>
	pipe(
		value,
		Match.value,
		Match.when(isUndefined, () => true),
		Match.when(isFeatureFlags, () => true),
		Match.orElse(() => false)
	);

const isLogger = (value: unknown): value is EmailAuthClientLogger =>
	pipe(
		value,
		Match.value,
		Match.when(
			isRecord,
			(candidate) =>
				hasOnlyKeys(candidate, loggerKeys) &&
				isFunction(candidate.debug) &&
				isFunction(candidate.info) &&
				isFunction(candidate.warn) &&
				isFunction(candidate.error)
		),
		Match.orElse(() => false)
	);

const isOptionalLogger = (value: unknown): value is EmailAuthClientLogger | undefined =>
	pipe(
		value,
		Match.value,
		Match.when(isUndefined, () => true),
		Match.when(isLogger, () => true),
		Match.orElse(() => false)
	);

const isTelemetry = (value: unknown): value is EmailAuthClientTelemetry =>
	pipe(
		value,
		Match.value,
		Match.when(isRecord, (candidate) => hasOnlyKeys(candidate, telemetryKeys) && isFunction(candidate.trackEvent)),
		Match.orElse(() => false)
	);

const isOptionalTelemetry = (value: unknown): value is EmailAuthClientTelemetry | undefined =>
	pipe(
		value,
		Match.value,
		Match.when(isUndefined, () => true),
		Match.when(isTelemetry, () => true),
		Match.orElse(() => false)
	);

const isAuthClient = (value: unknown): value is AuthClient =>
	pipe(
		value,
		Match.value,
		Match.when(
			(candidate: unknown): candidate is AuthClient => typeof candidate === 'object' && candidate !== null,
			() => true
		),
		Match.orElse(() => false)
	);

const isSignOutFetchOptions = (value: unknown): value is SignOutFetchOptions =>
	pipe(
		value,
		Match.value,
		Match.when(
			isRecord,
			(candidate) => hasOnlyKeys(candidate, signOutFetchOptionKeys) && isOptionalFunction(candidate.onSuccess) && isOptionalFunction(candidate.onError)
		),
		Match.orElse(() => false)
	);

const isEmailLike = (value: unknown): value is string => isNonEmptyString(value);

const isCallbackUrl = (value: unknown): value is string | undefined => isOptionalString(value);

const isRedirectUrl = (value: unknown): value is string | undefined => isOptionalString(value);

/**
 * Validates that a candidate satisfies the `EmailAuthClientDeps` contract.
 *
 * @pure
 * @description Ensures dependency bundles provide an auth client and optional adapters with correct shapes.
 *
 * @fp-pattern Type guard
 * @composition
 *   - `pipe(value, Match.value, Match.when(isRecord, ...), Match.orElse(() => false))`
 *
 * @param value - Candidate value to inspect.
 * @returns {value is EmailAuthClientDeps<AuthClient>} `true` when the value conforms to dependency expectations.
 */
export const isEmailAuthClientDeps = <TAuthClient extends AuthClient>(value: unknown): value is EmailAuthClientDeps<TAuthClient> =>
	pipe(
		value,
		Match.value,
		Match.when(
			isRecord,
			(candidate) =>
				hasOnlyKeys(candidate, emailAuthClientDepKeys) &&
				isAuthClient(candidate.authClient) &&
				isOptionalLogger(candidate.logger) &&
				isOptionalTelemetry(candidate.telemetry) &&
				isOptionalFeatureFlags(candidate.featureFlags)
		),
		Match.orElse(() => false)
	);

/**
 * Determines whether a value matches the `SignUpEmailInput` structure.
 *
 * @pure
 * @description Guards runtime inputs before invoking the sign-up handler.
 *
 * @fp-pattern Type guard
 * @composition
 *   - `pipe(value, Match.value, Match.when(isRecord, ...), Match.orElse(() => false))`
 *
 * @param value - Candidate value to inspect.
 * @returns {value is SignUpEmailInput} `true` when the payload matches the sign-up schema.
 */
export const isSignUpEmailInput = (value: unknown): value is SignUpEmailInput =>
	pipe(
		value,
		Match.value,
		Match.when(
			isRecord,
			(candidate) =>
				hasOnlyKeys(candidate, signUpKeys) &&
				isNonEmptyString(candidate.name) &&
				isEmailLike(candidate.email) &&
				isNonEmptyString(candidate.password) &&
				isOptionalString(candidate.image) &&
				isCallbackUrl(candidate.callbackUrl)
		),
		Match.orElse(() => false)
	);

/**
 * Determines whether a value matches the `SignInEmailInput` structure.
 *
 * @pure
 * @description Guards runtime inputs before invoking the sign-in handler.
 *
 * @fp-pattern Type guard
 * @composition
 *   - `pipe(value, Match.value, Match.when(isRecord, ...), Match.orElse(() => false))`
 *
 * @param value - Candidate value to inspect.
 * @returns {value is SignInEmailInput} `true` when the payload matches the sign-in schema.
 */
export const isSignInEmailInput = (value: unknown): value is SignInEmailInput =>
	pipe(
		value,
		Match.value,
		Match.when(
			isRecord,
			(candidate) =>
				hasOnlyKeys(candidate, signInKeys) &&
				isEmailLike(candidate.email) &&
				isNonEmptyString(candidate.password) &&
				isOptionalBoolean(candidate.rememberMe) &&
				isCallbackUrl(candidate.callbackUrl)
		),
		Match.orElse(() => false)
	);

/**
 * Determines whether a value adheres to the `SignOutOptions` configuration.
 *
 * @pure
 * @description Accepts undefined or an options object with optional lifecycle handlers.
 *
 * @fp-pattern Type guard
 * @composition
 *   - `pipe(value, Match.value, Match.when(...), Match.orElse(() => false))`
 *
 * @param value - Candidate options value to inspect.
 * @returns {value is SignOutOptions | undefined} `true` when the options are well formed.
 */
export const isSignOutOptions = (value: unknown): value is SignOutOptions | undefined =>
	pipe(
		value,
		Match.value,
		Match.when(isUndefined, () => true),
		Match.when(
			isRecord,
			(candidate) =>
				hasOnlyKeys(candidate, signOutKeys) &&
				isOptionalBoolean(candidate.all) &&
				isRedirectUrl(candidate.redirectTo) &&
				pipe(candidate.fetchOptions, (options) => options === undefined || isSignOutFetchOptions(options))
		),
		Match.orElse(() => false)
	);

/**
 * Determines whether a value matches the verification email payload.
 *
 * @pure
 * @description Guards inputs for the verification email helper.
 *
 * @fp-pattern Type guard
 * @composition
 *   - `pipe(value, Match.value, Match.when(isRecord, ...), Match.orElse(() => false))`
 *
 * @param value - Candidate value to inspect.
 * @returns {value is VerificationEmailInput} `true` when the payload matches expectations.
 */
export const isVerificationEmailInput = (value: unknown): value is VerificationEmailInput =>
	pipe(
		value,
		Match.value,
		Match.when(isRecord, (candidate) => hasOnlyKeys(candidate, verificationKeys) && isEmailLike(candidate.email) && isCallbackUrl(candidate.callbackUrl)),
		Match.orElse(() => false)
	);

/**
 * Determines whether a value matches the password reset request payload.
 *
 * @pure
 * @description Guards inputs for the password reset request helper.
 *
 * @fp-pattern Type guard
 * @composition
 *   - `pipe(value, Match.value, Match.when(isRecord, ...), Match.orElse(() => false))`
 *
 * @param value - Candidate value to inspect.
 * @returns {value is requestPasswordResetInput} `true` when the payload is valid.
 */
export const isRequestPasswordResetInput = (value: unknown): value is requestPasswordResetInput =>
	pipe(
		value,
		Match.value,
		Match.when(isRecord, (candidate) => hasOnlyKeys(candidate, requestResetKeys) && isEmailLike(candidate.email) && isRedirectUrl(candidate.redirectTo)),
		Match.orElse(() => false)
	);

/**
 * Determines whether a value matches the reset password payload.
 *
 * @pure
 * @description Guards inputs for the reset password helper.
 *
 * @fp-pattern Type guard
 * @composition
 *   - `pipe(value, Match.value, Match.when(isRecord, ...), Match.orElse(() => false))`
 *
 * @param value - Candidate value to inspect.
 * @returns {value is resetPasswordInput} `true` when the payload is valid.
 */
export const isResetPasswordInput = (value: unknown): value is resetPasswordInput =>
	pipe(
		value,
		Match.value,
		Match.when(
			isRecord,
			(candidate) => hasOnlyKeys(candidate, resetPasswordKeys) && isNonEmptyString(candidate.newPassword) && isNonEmptyString(candidate.token)
		),
		Match.orElse(() => false)
	);

/**
 * Determines whether a value matches the change password payload.
 *
 * @pure
 * @description Guards inputs for the change password helper.
 *
 * @fp-pattern Type guard
 * @composition
 *   - `pipe(value, Match.value, Match.when(isRecord, ...), Match.orElse(() => false))`
 *
 * @param value - Candidate value to inspect.
 * @returns {value is ChangePasswordInput} `true` when the payload is valid.
 */
export const isChangePasswordInput = (value: unknown): value is ChangePasswordInput =>
	pipe(
		value,
		Match.value,
		Match.when(
			isRecord,
			(candidate) =>
				hasOnlyKeys(candidate, changePasswordKeys) &&
				isNonEmptyString(candidate.newPassword) &&
				isNonEmptyString(candidate.currentPassword) &&
				isOptionalBoolean(candidate.revokeOtherSessions)
		),
		Match.orElse(() => false)
	);
