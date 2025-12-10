import * as Effect from 'effect/Effect';
import * as Match from 'effect/Match';
import { z } from 'zod';
import { extractAuthServerConfig } from '../extract-auth-server-config/extractAuthServerConfig';
import type { AuthServerFor } from '../../server/server.types';
import { AuthServerApiEndpoints } from '../../enums/authServerApiEndpoints.enum';

// =============================================================================
// EMAIL SCHEMA PROPERTIES
// =============================================================================

/**
 * Email field schema.
 *
 * @pure
 * @description Validates email format with a descriptive error message.
 */
export const emailSchema = z.string().email('Invalid email format');

/**
 * Email field schema with required validation.
 *
 * @pure
 * @description Validates email format and ensures non-empty value.
 */
export const emailRequiredSchema = z.string().email('Invalid email format').min(1, 'Email is required');

/**
 * New email field schema.
 *
 * @pure
 * @description Validates new email format for change email operations.
 */
export const newEmailSchema = z.string().email('Invalid email format');

// =============================================================================
// URL SCHEMA PROPERTIES
// =============================================================================

/**
 * Optional callback URL schema.
 *
 * @pure
 * @description Validates callback URL format when provided.
 */
export const callbackURLOptionalSchema = z.string().url('Invalid callback URL').optional();

/**
 * Optional redirect URL schema.
 *
 * @pure
 * @description Validates redirect URL format when provided.
 */
export const redirectToOptionalSchema = z.string().url('Invalid redirect URL').optional();

/**
 * Optional error callback URL schema.
 *
 * @pure
 * @description Validates error callback URL format when provided.
 */
export const errorCallbackURLOptionalSchema = z.string().url('Invalid error callback URL').optional();

/**
 * Optional new user callback URL schema.
 *
 * @pure
 * @description Validates new user callback URL format when provided.
 */
export const newUserCallbackURLOptionalSchema = z.string().url('Invalid new user callback URL').optional();

/**
 * Optional image URL schema.
 *
 * @pure
 * @description Validates image URL format when provided.
 */
export const imageURLOptionalSchema = z.string().url('Invalid image URL').optional();

/**
 * Optional nullable image URL schema.
 *
 * @pure
 * @description Validates image URL format when provided, allows null to clear image.
 */
export const imageURLNullableOptionalSchema = z.string().url('Invalid image URL').nullable().optional();

// =============================================================================
// TOKEN SCHEMA PROPERTIES
// =============================================================================

/**
 * Required token schema.
 *
 * @pure
 * @description Validates that token is a non-empty string.
 */
export const tokenRequiredSchema = z.string().min(1, 'Token is required');

/**
 * Required reset token schema.
 *
 * @pure
 * @description Validates that reset token is a non-empty string.
 */
export const resetTokenRequiredSchema = z.string().min(1, 'Reset token is required');

/**
 * Required session token schema.
 *
 * @pure
 * @description Validates that session token is a non-empty string.
 */
export const sessionTokenRequiredSchema = z.string().min(1, 'Session token is required');

/**
 * Optional token schema.
 *
 * @pure
 * @description Validates token format when provided.
 */
export const tokenOptionalSchema = z.string().optional();

// =============================================================================
// PASSWORD SCHEMA PROPERTIES
// =============================================================================

/**
 * Creates a password schema with configurable constraints.
 *
 * @pure
 * @description Generates a password schema with min/max length validation.
 *
 * @param minLength - Minimum password length
 * @param maxLength - Maximum password length
 */
export const createPasswordSchema = (minLength: number, maxLength: number) => z.string().min(minLength).max(maxLength);

/**
 * Current password schema (required for password change).
 *
 * @pure
 * @description Validates that current password is provided.
 */
export const currentPasswordRequiredSchema = z.string().min(1, 'Current password is required');

/**
 * Optional password schema.
 *
 * @pure
 * @description Validates password format when provided.
 */
export const passwordOptionalSchema = z.string().optional();

// =============================================================================
// PROVIDER SCHEMA PROPERTIES
// =============================================================================

/**
 * Required provider schema.
 *
 * @pure
 * @description Validates that provider is a non-empty string.
 */
export const providerRequiredSchema = z.string().min(1, 'Provider is required');

/**
 * Required provider ID schema.
 *
 * @pure
 * @description Validates that provider ID is a non-empty string.
 */
export const providerIdRequiredSchema = z.string().min(1, 'Provider ID is required');

// =============================================================================
// USER PROFILE SCHEMA PROPERTIES
// =============================================================================

/**
 * Required name schema.
 *
 * @pure
 * @description Validates that name is a non-empty string.
 */
export const nameRequiredSchema = z.string().min(1, 'Name is required');

/**
 * Optional name schema (for updates).
 *
 * @pure
 * @description Validates name format when provided.
 */
export const nameOptionalSchema = z.string().min(1, 'Name cannot be empty').optional();

/**
 * Optional email schema (for updates).
 *
 * @pure
 * @description Validates email format when provided.
 */
export const emailOptionalSchema = z.string().email('Invalid email format').optional();

// =============================================================================
// BOOLEAN OPTION SCHEMA PROPERTIES
// =============================================================================

/**
 * Optional remember me schema.
 *
 * @pure
 * @description Validates remember me option when provided.
 */
export const rememberMeOptionalSchema = z.boolean().optional();

/**
 * Optional revoke other sessions schema.
 *
 * @pure
 * @description Validates revoke other sessions option when provided.
 */
export const revokeOtherSessionsOptionalSchema = z.boolean().optional();

/**
 * Optional disable redirect schema.
 *
 * @pure
 * @description Validates disable redirect option when provided.
 */
export const disableRedirectOptionalSchema = z.boolean().optional();

// =============================================================================
// OAUTH SCHEMA PROPERTIES
// =============================================================================

/**
 * OAuth query parameters schema.
 *
 * @pure
 * @description Validates OAuth callback query parameters.
 */
export const oauthQueryParamsOptionalSchema = z
	.object({
		code: z.string().optional(),
		state: z.string().optional(),
		error: z.string().optional(),
		error_description: z.string().optional(),
	})
	.optional();

/**
 * ID Token schema for OAuth.
 *
 * @pure
 * @description Validates ID token structure for OAuth authentication.
 */
export const idTokenOptionalSchema = z
	.object({
		token: z.string(),
		nonce: z.string().optional(),
		accessToken: z.string().optional(),
		refreshToken: z.string().optional(),
		expiresAt: z.number().optional(),
	})
	.optional();

// =============================================================================
// COMMON BODY SCHEMAS
// =============================================================================

/**
 * Email body schema.
 *
 * @pure
 * @description Body schema for email-only requests.
 */
export const emailBodySchema = z.object({
	email: emailSchema,
});

/**
 * Email with callback URL body schema.
 *
 * @pure
 * @description Body schema for email requests with optional callback URL.
 */
export const emailWithCallbackBodySchema = z.object({
	email: emailSchema,
	callbackURL: callbackURLOptionalSchema,
});

/**
 * Email with redirect body schema.
 *
 * @pure
 * @description Body schema for email requests with optional redirect URL.
 */
export const emailWithRedirectBodySchema = z.object({
	email: emailSchema,
	redirectTo: redirectToOptionalSchema,
});

/**
 * Email required with redirect body schema.
 *
 * @pure
 * @description Body schema for required email with optional redirect URL.
 */
export const emailRequiredWithRedirectBodySchema = z.object({
	email: emailRequiredSchema,
	redirectTo: redirectToOptionalSchema,
});

/**
 * New email body schema.
 *
 * @pure
 * @description Body schema for change email requests.
 */
export const newEmailBodySchema = z.object({
	newEmail: newEmailSchema,
	callbackURL: callbackURLOptionalSchema,
});

/**
 * Provider body schema.
 *
 * @pure
 * @description Body schema for provider-only requests.
 */
export const providerBodySchema = z.object({
	provider: providerRequiredSchema,
});

/**
 * Provider with callback URL body schema.
 *
 * @pure
 * @description Body schema for provider requests with optional callback URL.
 */
export const providerWithCallbackBodySchema = z.object({
	provider: providerRequiredSchema,
	callbackURL: callbackURLOptionalSchema,
});

/**
 * Provider ID body schema.
 *
 * @pure
 * @description Body schema for provider ID requests.
 */
export const providerIdBodySchema = z.object({
	providerId: providerIdRequiredSchema,
});

/**
 * Session token body schema.
 *
 * @pure
 * @description Body schema for session token requests.
 */
export const sessionTokenBodySchema = z.object({
	token: sessionTokenRequiredSchema,
});

/**
 * Builds a Zod schema for the API endpoint body based on the provided endpoint.
 *
 * @pure
 * @description Retrieves the AuthServer configuration using `extractAuthServerConfig` and
 * generates a Zod schema tailored to the specific endpoint requirements.
 *
 * @param endpoint - The API endpoint to generate the schema for.
 * @returns Effect that resolves to the generated Zod schema.
 */
export const authServerApiEndpointBodyZodSchemaBuilder = <K extends AuthServerApiEndpoints>(endpoint: K): Effect.Effect<z.ZodSchema, Error, AuthServerFor> =>
	Effect.gen(function* () {
		return yield* Match.value(endpoint as AuthServerApiEndpoints).pipe(
			Match.when(AuthServerApiEndpoints.signInEmail, () =>
				Effect.gen(function* () {
					const config = yield* extractAuthServerConfig('emailAndPassword');
					const options = config?.emailAndPassword;
					const minPasswordLength = options?.minPasswordLength ?? 8;
					const maxPasswordLength = options?.maxPasswordLength ?? 32;
					return z.object({
						email: emailSchema,
						password: createPasswordSchema(minPasswordLength, maxPasswordLength),
					});
				})
			),
			Match.when(AuthServerApiEndpoints.signUpEmail, () =>
				Effect.gen(function* () {
					const config = yield* extractAuthServerConfig('emailAndPassword');
					const options = config?.emailAndPassword;
					const minPasswordLength = options?.minPasswordLength ?? 8;
					const maxPasswordLength = options?.maxPasswordLength ?? 32;
					return z.object({
						email: emailSchema,
						password: createPasswordSchema(minPasswordLength, maxPasswordLength),
						name: nameOptionalSchema,
						image: imageURLOptionalSchema,
					});
				})
			),
			Match.when(AuthServerApiEndpoints.signInSocial, () =>
				Effect.succeed(
					z.object({
						provider: providerRequiredSchema,
						callbackURL: callbackURLOptionalSchema,
					})
				)
			),
			Match.orElse(() => Effect.succeed(z.object({})))
		);
	});
