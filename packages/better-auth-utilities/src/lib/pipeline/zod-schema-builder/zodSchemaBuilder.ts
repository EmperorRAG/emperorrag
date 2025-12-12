/**
 * @file libs/better-auth-utilities/src/lib/pipeline/zod-schema-builder/zodSchemaBuilder.ts
 * @description Functional pipeline builder for Zod schemas.
 * Enables tree-shakeable, composable schema construction using the Effect pipe pattern.
 */

import * as Effect from 'effect/Effect';
import { pipe } from 'effect/Function';
import * as Match from 'effect/Match';
import { z } from 'zod';
import { AuthServerApiEndpoints } from '../../enums/authServerApiEndpoints.enum';
import {
	authServerApiEndpointBodyZodSchemaBuilder,
	tokenRequiredSchema,
} from '../auth-server-api-endpoint-body-zod-schema-builder/authServerApiEndpointBodyZodSchemaBuilder';
import type { CreateAuthServerApiEndpointParamsSchemaProps } from './zodSchemaBuilder.types';
export * from '../auth-server-api-endpoint-body-zod-schema-builder/authServerApiEndpointBodyZodSchemaBuilder';
// import { AuthServerTag } from '../../server/server.service';

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
// COMPOSITE SCHEMA BUILDERS (LEGACY)
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

// =============================================================================
// PIPELINE BUILDER FUNCTIONS
// =============================================================================

/**
 * Creates a base empty Zod object schema.
 *
 * @pure
 * @description Starts the schema building pipeline with an empty object.
 */
export const createBaseSchema = () => z.object({});

/**
 * Adds a body field to the schema.
 *
 * @pure
 * @description Extends the schema with a 'body' property containing the provided schema.
 *
 * @param bodySchema - The schema for the body property
 */
export const withBody =
	<T extends z.ZodTypeAny>(bodySchema: T) =>
	<Base extends z.ZodObject<any>>(base: Base) =>
		base.extend({
			body: bodySchema,
		});

/**
 * Adds a query field to the schema.
 *
 * @pure
 * @description Extends the schema with a 'query' property containing the provided schema.
 *
 * @param querySchema - The schema for the query property
 */
export const withQuery =
	<T extends z.ZodTypeAny>(querySchema: T) =>
	<Base extends z.ZodObject<any>>(base: Base) =>
		base.extend({
			query: querySchema,
		});

/**
 * Adds optional headers and standard request options to the schema.
 *
 * @pure
 * @description Extends the schema with optional headers, asResponse, and returnHeaders.
 * Used for endpoints that do not require authentication.
 */
export const withOptionalHeaders =
	() =>
	<Base extends z.ZodObject<any>>(base: Base) =>
		base.extend(requestOptionsOptionalHeadersShape);

/**
 * Adds required headers and standard request options to the schema.
 *
 * @pure
 * @description Extends the schema with required headers, asResponse, and returnHeaders.
 * Used for endpoints that require authentication (session identification).
 *
 * @param headerMessage - Custom error message for missing headers
 */
export const withRequiredHeaders =
	(headerMessage?: string) =>
	<Base extends z.ZodObject<any>>(base: Base) =>
		base.extend(requestOptionsRequiredHeadersShape(headerMessage));

/**
 * Adds arbitrary additional fields to the schema.
 *
 * @pure
 * @description Extends the schema with any provided Zod raw shape.
 * Useful for adding top-level properties that don't fit into body/query/headers.
 *
 * @param shape - The Zod raw shape to add
 */
export const withAdditionalFields =
	<T extends z.ZodRawShape>(shape: T) =>
	<Base extends z.ZodObject<any>>(base: Base) =>
		base.extend(shape);

// =============================================================================
// WORKFLOW PIPELINE FACTORY
// =============================================================================

/**
 * Creates a Zod schema using the AuthServer context.
 *
 * @param endpoint - The API endpoint to generate the schema for.
 * @returns An Effect that resolves to the Zod schema.
 */
export const createAuthServerApiEndpointParamsSchema: CreateAuthServerApiEndpointParamsSchemaProps = <K extends AuthServerApiEndpoints>(endpoint: K) =>
	Effect.gen(function* () {
		const bodySchema = yield* authServerApiEndpointBodyZodSchemaBuilder(endpoint);

		const config = Match.value(endpoint as AuthServerApiEndpoints).pipe(
			Match.when(AuthServerApiEndpoints.verifyEmail, () => ({ headers: 'optional' as const, query: tokenQuerySchema })),
			Match.when(AuthServerApiEndpoints.signInEmail, () => ({ headers: 'optional' as const })),
			Match.when(AuthServerApiEndpoints.signUpEmail, () => ({ headers: 'optional' as const })),
			Match.when(AuthServerApiEndpoints.signInSocial, () => ({ headers: 'optional' as const })),
			Match.when(AuthServerApiEndpoints.forgetPassword, () => ({ headers: 'optional' as const })),
			Match.when(AuthServerApiEndpoints.resetPassword, () => ({ headers: 'optional' as const })),
			Match.when(AuthServerApiEndpoints.callbackOAuth, () => ({ headers: 'optional' as const })),
			Match.when(AuthServerApiEndpoints.requestPasswordReset, () => ({ headers: 'optional' as const })),
			Match.orElse(() => ({ headers: 'required' as const }))
		);

		let schema = createBaseSchema();

		schema = pipe(schema, withBody(bodySchema));

		if ('query' in config && config.query) {
			schema = pipe(schema, withQuery(config.query));
		}

		if (config.headers === 'required') {
			schema = pipe(schema, withRequiredHeaders());
		} else {
			schema = pipe(schema, withOptionalHeaders());
		}

		return schema;
	});
