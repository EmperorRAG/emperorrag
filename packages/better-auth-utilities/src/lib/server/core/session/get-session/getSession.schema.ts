/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/get-session/getSession.schema.ts
 * @description Zod schema generation for getSession server validation.
 * Provides dynamic schema creation based on Better Auth server configuration.
 */

import { Effect } from 'effect';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';
import { SessionAuthServerServiceTag } from '../shared/session.service';
import type { SessionAuthServerService } from '../shared/session.types';

/**
 * Creates a Zod schema for validating getSession server parameters.
 *
 * @pure
 * @description Dynamically generates a validation schema for session retrieval parameters.
 * Returns an Effect that succeeds with the appropriate Zod schema for validating
 * getSession input parameters.
 *
 * @param authServer - The Better Auth server instance (used for potential config extraction)
 * @returns Effect succeeding with a Zod schema for validating getSession input parameters
 *
 * @example
 * ```typescript
 * import { Effect } from 'effect';
 * import { SessionAuthServerServiceTag } from '../shared/session.service';
 * import { createGetSessionServerParamsSchema } from './getSession.schema';
 *
 * const program = Effect.gen(function* (_) {
 *   const { authServer } = yield* _(SessionAuthServerServiceTag);
 *   const schema = yield* _(createGetSessionServerParamsSchema(authServer));
 *
 *   // Validate incoming data
 *   const result = schema.safeParse({
 *     headers: request.headers
 *   });
 *
 *   if (result.success) {
 *     return result.data;
 *   } else {
 *     throw new Error('Validation failed');
 *   }
 * });
 * ```
 */
export const createGetSessionServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(_authServer: T) =>
	Effect.succeed(
		z.object({
			headers: z.instanceof(Headers, {
				message: 'headers must be an instance of Headers for session lookup',
			}),
			asResponse: z.boolean().optional(),
			returnHeaders: z.boolean().optional(),
		})
	);

/**
 * Creates a Zod schema for validating getSession server parameters using Effect Context.
 *
 * @pure
 * @description Alternative version that retrieves authServer from context rather than parameter.
 * Useful when working within Effect pipelines where the service is already in context.
 *
 * @returns Effect requiring SessionAuthServerService context, succeeding with a Zod schema
 *
 * @example
 * ```typescript
 * import { Effect } from 'effect';
 * import { createGetSessionServerParamsSchemaFromContext } from './getSession.schema';
 *
 * const program = Effect.gen(function* (_) {
 *   const schema = yield* _(createGetSessionServerParamsSchemaFromContext());
 *   const parsed = schema.safeParse(input);
 *   // ...
 * });
 *
 * await Effect.runPromise(
 *   Effect.provideService(program, SessionAuthServerServiceTag, { authServer })
 * );
 * ```
 */
export const createGetSessionServerParamsSchemaFromContext = (): Effect.Effect<
	z.ZodObject<{
		headers: z.ZodType<Headers>;
		asResponse: z.ZodOptional<z.ZodBoolean>;
		returnHeaders: z.ZodOptional<z.ZodBoolean>;
	}>,
	never,
	SessionAuthServerService
> => Effect.flatMap(SessionAuthServerServiceTag, ({ authServer }) => createGetSessionServerParamsSchema(authServer));
