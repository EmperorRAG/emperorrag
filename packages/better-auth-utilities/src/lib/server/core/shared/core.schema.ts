/**
 * @file libs/better-auth-utilities/src/lib/server/core/shared/core.schema.ts
 * @description Centralized Zod schema property definitions for server-side validation.
 * Provides reusable schema components to ensure consistency across all server schema files.
 */

import { z } from 'zod';

// =============================================================================
// REQUEST OPTIONS SCHEMA PROPERTIES
// =============================================================================

/**
 * Optional headers schema for endpoints that don't require authentication.
 *
 * @pure
 * @description Validates that headers, if provided, is an instance of the Headers class.
 */
export const headersOptionalSchema = z.instanceof(Headers).optional();

/**
 * Required headers schema for endpoints that require session authentication.
 *
 * @pure
 * @description Validates that headers is an instance of the Headers class.
 * Used for endpoints that need to identify the user via session cookie.
 *
 * @param message - Custom error message for validation failure
 */
export const headersRequiredSchema = (message = 'Headers instance required for session identification') => z.instanceof(Headers, { message });

/**
 * Schema for the asResponse option.
 *
 * @pure
 * @description When true, returns a Response object instead of parsed data.
 */
export const asResponseSchema = z.boolean().optional();

/**
 * Schema for the returnHeaders option.
 *
 * @pure
 * @description When true, includes response headers in the result.
 */
export const returnHeadersSchema = z.boolean().optional();

/**
 * Common request options schema shape (optional headers).
 *
 * @pure
 * @description Provides the standard request options for endpoints that don't require authentication.
 */
export const requestOptionsOptionalHeadersShape = {
	headers: headersOptionalSchema,
	asResponse: asResponseSchema,
	returnHeaders: returnHeadersSchema,
} as const;

/**
 * Creates request options schema shape with required headers.
 *
 * @pure
 * @description Provides the standard request options for endpoints that require authentication.
 *
 * @param headerMessage - Custom error message for headers validation
 */
export const requestOptionsRequiredHeadersShape = (headerMessage?: string) =>
	({
		headers: headersRequiredSchema(headerMessage),
		asResponse: asResponseSchema,
		returnHeaders: returnHeadersSchema,
	}) as const;

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
// COMMON QUERY SCHEMAS
// =============================================================================

/**
 * Token query schema.
 *
 * @pure
 * @description Query schema for endpoints that require a token parameter.
 */
export const tokenQuerySchema = z.object({
	token: tokenRequiredSchema,
});

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

// =============================================================================
// COMPOSITE SCHEMA BUILDERS
// =============================================================================

/**
 * Creates a schema with optional headers and standard request options.
 *
 * @pure
 * @description Builds a complete request schema with optional headers.
 *
 * @param additionalFields - Additional fields to include in the schema
 */
export const createSchemaWithOptionalHeaders = <T extends z.ZodRawShape>(additionalFields?: T) =>
	z.object({
		...additionalFields,
		...requestOptionsOptionalHeadersShape,
	});

/**
 * Creates a schema with required headers and standard request options.
 *
 * @pure
 * @description Builds a complete request schema with required headers.
 *
 * @param additionalFields - Additional fields to include in the schema
 * @param headerMessage - Custom error message for headers validation
 */
export const createSchemaWithRequiredHeaders = <T extends z.ZodRawShape>(additionalFields?: T, headerMessage?: string) =>
	z.object({
		...additionalFields,
		...requestOptionsRequiredHeadersShape(headerMessage),
	});

/**
 * Creates a body schema with standard request options (optional headers).
 *
 * @pure
 * @description Builds a complete request schema with a body field and optional headers.
 *
 * @param bodySchema - The Zod schema for the body field
 */
export const createBodySchemaWithOptionalHeaders = <T extends z.ZodTypeAny>(bodySchema: T) =>
	z.object({
		body: bodySchema,
		...requestOptionsOptionalHeadersShape,
	});

/**
 * Creates a body schema with standard request options (required headers).
 *
 * @pure
 * @description Builds a complete request schema with a body field and required headers.
 *
 * @param bodySchema - The Zod schema for the body field
 * @param headerMessage - Custom error message for headers validation
 */
export const createBodySchemaWithRequiredHeaders = <T extends z.ZodTypeAny>(bodySchema: T, headerMessage?: string) =>
	z.object({
		body: bodySchema,
		...requestOptionsRequiredHeadersShape(headerMessage),
	});

/**
 * Creates a query schema with standard request options (optional headers).
 *
 * @pure
 * @description Builds a complete request schema with a query field and optional headers.
 *
 * @param querySchema - The Zod schema for the query field
 */
export const createQuerySchemaWithOptionalHeaders = <T extends z.ZodTypeAny>(querySchema: T) =>
	z.object({
		query: querySchema,
		...requestOptionsOptionalHeadersShape,
	});

/**
 * Creates a query schema with standard request options (required headers).
 *
 * @pure
 * @description Builds a complete request schema with a query field and required headers.
 *
 * @param querySchema - The Zod schema for the query field
 * @param headerMessage - Custom error message for headers validation
 */
export const createQuerySchemaWithRequiredHeaders = <T extends z.ZodTypeAny>(querySchema: T, headerMessage?: string) =>
	z.object({
		query: querySchema,
		...requestOptionsRequiredHeadersShape(headerMessage),
	});
