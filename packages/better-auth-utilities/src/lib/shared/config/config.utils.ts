import * as Option from 'effect/Option';
import type { AuthOptions } from './config.types';
import type { AuthServerFor } from '../../server/server.types';

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
