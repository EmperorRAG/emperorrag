/**
 * @file libs/better-auth-utilities/src/lib/pipeline/zod-schema-builder/zodSchemaBuilder.ts
 * @description Functional pipeline builder for Zod schemas.
 * Enables tree-shakeable, composable schema construction using the Effect pipe pattern.
 */

import { z } from 'zod';
import { requestOptionsOptionalHeadersShape, requestOptionsRequiredHeadersShape } from '../../server/core/shared/core.schema';

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
