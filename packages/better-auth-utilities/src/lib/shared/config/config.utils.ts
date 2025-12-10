import { pipe } from 'effect';
import * as Option from 'effect/Option';
import type { AuthOptions } from './config.types';
import type { AuthServerFor } from '../../server/server.types';
import { DEFAULT_MIN_PASSWORD_LENGTH, DEFAULT_MAX_PASSWORD_LENGTH, DEFAULT_RESET_PASSWORD_TOKEN_EXPIRES_IN } from './config.constants';

// =============================================================================
// AUTH SERVER CONFIG EXTRACTORS
// =============================================================================

/**
 * Extracts the BetterAuth configuration options from an AuthServer instance.
 *
 * @pure
 * @description Retrieves the `options` property from the AuthServer instance if available.
 * This configuration contains settings for database, plugins, and other server behaviors.
 *
 * @param authServer - The Better Auth server instance
 * @returns Option.Option<AuthOptions> - The configuration options if found
 */
export const getAuthServerConfig = <T extends AuthServerFor = AuthServerFor>(authServer: T): Option.Option<AuthOptions> => {
	return Option.fromNullable(authServer.options);
};

// =============================================================================
// EMAIL AND PASSWORD CONFIG EXTRACTORS
// =============================================================================

/**
 * Extracts the email and password configuration from BetterAuth options.
 *
 * @pure
 * @description Retrieves the `emailAndPassword` configuration object from the BetterAuth options.
 * This includes settings like minimum password length, maximum password length, and whether the provider is enabled.
 *
 * @param options - The Better Auth configuration options
 * @returns Option.Option<NonNullable<AuthOptions['emailAndPassword']>> - The email and password config if present
 */
export const getEmailAndPasswordConfig = (options: AuthOptions): Option.Option<NonNullable<AuthOptions['emailAndPassword']>> => {
	return Option.fromNullable(options.emailAndPassword);
};

/**
 * Extracts the minimum password length from emailAndPassword configuration.
 *
 * @pure
 * @description Retrieves the `minPasswordLength` value from the emailAndPassword configuration.
 *
 * @param emailPasswordConfig - The email and password configuration object
 * @returns Option.Option<number> - The minimum password length if configured
 */
export const getMinPasswordLengthFromConfig = (emailPasswordConfig: NonNullable<AuthOptions['emailAndPassword']>): Option.Option<number> => {
	return Option.fromNullable(emailPasswordConfig.minPasswordLength);
};

/**
 * Extracts the maximum password length from emailAndPassword configuration.
 *
 * @pure
 * @description Retrieves the `maxPasswordLength` value from the emailAndPassword configuration.
 *
 * @param emailPasswordConfig - The email and password configuration object
 * @returns Option.Option<number> - The maximum password length if configured
 */
export const getMaxPasswordLengthFromConfig = (emailPasswordConfig: NonNullable<AuthOptions['emailAndPassword']>): Option.Option<number> => {
	return Option.fromNullable(emailPasswordConfig.maxPasswordLength);
};

/**
 * Extracts the reset password token expiration from emailAndPassword configuration.
 *
 * @pure
 * @description Retrieves the `resetPasswordTokenExpiresIn` value from the emailAndPassword configuration.
 *
 * @param emailPasswordConfig - The email and password configuration object
 * @returns Option.Option<number> - The reset password token expiration in seconds if configured
 */
export const getResetPasswordTokenExpiresInFromConfig = (emailPasswordConfig: NonNullable<AuthOptions['emailAndPassword']>): Option.Option<number> => {
	return Option.fromNullable(emailPasswordConfig.resetPasswordTokenExpiresIn);
};

/**
 * Extracts the require email verification setting from emailAndPassword configuration.
 *
 * @pure
 * @description Retrieves the `requireEmailVerification` value from the emailAndPassword configuration.
 *
 * @param emailPasswordConfig - The email and password configuration object
 * @returns Option.Option<boolean> - Whether email verification is required if configured
 */
export const getRequireEmailVerificationFromConfig = (emailPasswordConfig: NonNullable<AuthOptions['emailAndPassword']>): Option.Option<boolean> => {
	return Option.fromNullable(emailPasswordConfig.requireEmailVerification);
};

/**
 * Extracts the auto sign-in after sign-up setting from emailAndPassword configuration.
 *
 * @pure
 * @description Retrieves the `autoSignIn` value from the emailAndPassword configuration.
 * When true (default), users are automatically signed in after successful registration.
 *
 * @param emailPasswordConfig - The email and password configuration object
 * @returns Option.Option<boolean> - Whether auto sign-in is enabled if configured
 */
export const getAutoSignInFromConfig = (emailPasswordConfig: NonNullable<AuthOptions['emailAndPassword']>): Option.Option<boolean> => {
	return Option.fromNullable(emailPasswordConfig.autoSignIn);
};

// =============================================================================
// EMAIL VERIFICATION CONFIG EXTRACTORS
// =============================================================================

/**
 * Extracts the email verification configuration from BetterAuth options.
 *
 * @pure
 * @description Retrieves the `emailVerification` configuration object from the BetterAuth options.
 * This includes settings like whether to send verification email on sign-up and auto sign-in after verification.
 *
 * @param options - The Better Auth configuration options
 * @returns Option.Option<NonNullable<AuthOptions['emailVerification']>> - The email verification config if present
 */
export const getEmailVerificationConfig = (options: AuthOptions): Option.Option<NonNullable<AuthOptions['emailVerification']>> => {
	return Option.fromNullable(options.emailVerification);
};

/**
 * Extracts the send-on-signup setting from email verification configuration.
 *
 * @pure
 * @description Retrieves the `sendOnSignUp` value from the emailVerification configuration.
 *
 * @param emailVerificationConfig - The email verification configuration object
 * @returns Option.Option<boolean> - Whether verification email is sent on sign-up if configured
 */
export const getSendOnSignUpFromConfig = (emailVerificationConfig: NonNullable<AuthOptions['emailVerification']>): Option.Option<boolean> => {
	return Option.fromNullable(emailVerificationConfig.sendOnSignUp);
};

/**
 * Extracts the auto-sign-in-after-verification setting from email verification configuration.
 *
 * @pure
 * @description Retrieves the `autoSignInAfterVerification` value from the emailVerification configuration.
 *
 * @param emailVerificationConfig - The email verification configuration object
 * @returns Option.Option<boolean> - Whether auto sign-in after verification is enabled if configured
 */
export const getAutoSignInAfterVerificationFromConfig = (emailVerificationConfig: NonNullable<AuthOptions['emailVerification']>): Option.Option<boolean> => {
	return Option.fromNullable(emailVerificationConfig.autoSignInAfterVerification);
};

// =============================================================================
// USER CONFIG EXTRACTORS
// =============================================================================

/**
 * Extracts the user configuration from BetterAuth options.
 *
 * @pure
 * @description Retrieves the `user` configuration object from the BetterAuth options.
 * This includes settings for additional fields, model mapping, and other user-related configurations.
 *
 * @param options - The Better Auth configuration options
 * @returns Option.Option<NonNullable<AuthOptions['user']>> - The user config if present
 */
export const getUserConfig = (options: AuthOptions): Option.Option<NonNullable<AuthOptions['user']>> => {
	return Option.fromNullable(options.user);
};

/**
 * Extracts the additional fields configuration from the user config.
 *
 * @pure
 * @description Retrieves the `additionalFields` object from the user configuration.
 * These fields define custom properties on the user model that should be validated during sign-up.
 *
 * @param userConfig - The user configuration object
 * @returns Option.Option<NonNullable<AuthOptions['user']['additionalFields']>> - The additional fields config if present
 */
export const getUserAdditionalFields = (
	userConfig: NonNullable<AuthOptions['user']>
): Option.Option<NonNullable<NonNullable<AuthOptions['user']>['additionalFields']>> => {
	return Option.fromNullable(userConfig.additionalFields);
};

/**
 * Extracts the change email configuration from the user config.
 *
 * @pure
 * @description Retrieves the `changeEmail` configuration object from the user configuration.
 * This includes settings for change email functionality like the verification sender.
 *
 * @param userConfig - The user configuration object
 * @returns Option.Option<NonNullable<AuthOptions['user']['changeEmail']>> - The change email config if present
 */
export const getChangeEmailConfig = (
	userConfig: NonNullable<AuthOptions['user']>
): Option.Option<NonNullable<NonNullable<AuthOptions['user']>['changeEmail']>> => {
	return Option.fromNullable(userConfig.changeEmail);
};

/**
 * Checks if change email functionality is enabled in the user config.
 *
 * @pure
 * @description Determines if change email is enabled by checking if `changeEmail.enabled` is true.
 *
 * @param userConfig - The user configuration object
 * @returns boolean - True if change email is enabled, false otherwise
 */
export const isChangeEmailEnabled = (userConfig: NonNullable<AuthOptions['user']>): boolean => {
	return pipe(
		getChangeEmailConfig(userConfig),
		Option.flatMap((config) => Option.fromNullable(config.enabled)),
		Option.getOrElse(() => false)
	);
};

// =============================================================================
// COMPOSITE HELPER FUNCTIONS
// =============================================================================

/**
 * Extracts the minimum password length from an AuthServer instance with a default fallback.
 *
 * @pure
 * @description Retrieves the minimum password length from the AuthServer's emailAndPassword configuration.
 * Falls back to DEFAULT_MIN_PASSWORD_LENGTH (8) if not configured.
 *
 * @param authServer - The Better Auth server instance
 * @returns number - The minimum password length
 */
export const getMinPasswordLength = <T extends AuthServerFor = AuthServerFor>(authServer: T): number =>
	pipe(
		getAuthServerConfig(authServer),
		Option.flatMap(getEmailAndPasswordConfig),
		Option.flatMap(getMinPasswordLengthFromConfig),
		Option.getOrElse(() => DEFAULT_MIN_PASSWORD_LENGTH)
	);

/**
 * Extracts the maximum password length from an AuthServer instance with a default fallback.
 *
 * @pure
 * @description Retrieves the maximum password length from the AuthServer's emailAndPassword configuration.
 * Falls back to DEFAULT_MAX_PASSWORD_LENGTH (128) if not configured.
 *
 * @param authServer - The Better Auth server instance
 * @returns number - The maximum password length
 */
export const getMaxPasswordLength = <T extends AuthServerFor = AuthServerFor>(authServer: T): number =>
	pipe(
		getAuthServerConfig(authServer),
		Option.flatMap(getEmailAndPasswordConfig),
		Option.flatMap(getMaxPasswordLengthFromConfig),
		Option.getOrElse(() => DEFAULT_MAX_PASSWORD_LENGTH)
	);

/**
 * Extracts both minimum and maximum password lengths from an AuthServer instance.
 *
 * @pure
 * @description Retrieves both password length constraints from the AuthServer's emailAndPassword configuration.
 * Falls back to defaults if not configured.
 *
 * @param authServer - The Better Auth server instance
 * @returns { minPasswordLength: number; maxPasswordLength: number } - The password length constraints
 */
export const getPasswordLengthConstraints = <T extends AuthServerFor = AuthServerFor>(
	authServer: T
): { minPasswordLength: number; maxPasswordLength: number } => ({
	minPasswordLength: getMinPasswordLength(authServer),
	maxPasswordLength: getMaxPasswordLength(authServer),
});

/**
 * Extracts the reset password token expiration from an AuthServer instance with a default fallback.
 *
 * @pure
 * @description Retrieves the reset password token expiration from the AuthServer's emailAndPassword configuration.
 * Falls back to DEFAULT_RESET_PASSWORD_TOKEN_EXPIRES_IN (3600 seconds) if not configured.
 *
 * @param authServer - The Better Auth server instance
 * @returns number - The reset password token expiration in seconds
 */
export const getResetPasswordTokenExpiresIn = <T extends AuthServerFor = AuthServerFor>(authServer: T): number =>
	pipe(
		getAuthServerConfig(authServer),
		Option.flatMap(getEmailAndPasswordConfig),
		Option.flatMap(getResetPasswordTokenExpiresInFromConfig),
		Option.getOrElse(() => DEFAULT_RESET_PASSWORD_TOKEN_EXPIRES_IN)
	);

/**
 * Checks if email verification is required from an AuthServer instance.
 *
 * @pure
 * @description Retrieves the require email verification setting from the AuthServer's emailAndPassword configuration.
 * Falls back to false if not configured.
 *
 * @param authServer - The Better Auth server instance
 * @returns boolean - Whether email verification is required
 */
export const isEmailVerificationRequired = <T extends AuthServerFor = AuthServerFor>(authServer: T): boolean =>
	pipe(
		getAuthServerConfig(authServer),
		Option.flatMap(getEmailAndPasswordConfig),
		Option.flatMap(getRequireEmailVerificationFromConfig),
		Option.getOrElse(() => false)
	);

/**
 * Checks if auto sign-in is enabled from an AuthServer instance.
 *
 * @pure
 * @description Retrieves the auto sign-in setting from the AuthServer's emailAndPassword configuration.
 * Falls back to true (enabled by default) if not configured.
 *
 * @param authServer - The Better Auth server instance
 * @returns boolean - Whether auto sign-in is enabled
 */
export const isAutoSignInEnabled = <T extends AuthServerFor = AuthServerFor>(authServer: T): boolean =>
	pipe(
		getAuthServerConfig(authServer),
		Option.flatMap(getEmailAndPasswordConfig),
		Option.flatMap(getAutoSignInFromConfig),
		Option.getOrElse(() => true)
	);

/**
 * Checks if change email functionality is enabled from an AuthServer instance.
 *
 * @pure
 * @description Retrieves the change email enabled setting from the AuthServer's user configuration.
 * Falls back to false if not configured.
 *
 * @param authServer - The Better Auth server instance
 * @returns boolean - Whether change email functionality is enabled
 */
export const isChangeEmailEnabledForServer = <T extends AuthServerFor = AuthServerFor>(authServer: T): boolean =>
	pipe(
		getAuthServerConfig(authServer),
		Option.flatMap(getUserConfig),
		Option.map(isChangeEmailEnabled),
		Option.getOrElse(() => false)
	);
