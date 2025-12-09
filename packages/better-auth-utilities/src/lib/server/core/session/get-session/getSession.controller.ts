/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/get-session/getSession.controller.ts
 * @description Controller for getSession server operations with input validation.
 * Combines schema validation with service execution in a type-safe manner.
 */

import { Effect } from 'effect';
import type { AuthServerFor } from '../../../server.types';
import { SessionAuthServerInputError } from '../shared/session.error';
import { SessionAuthServerServiceTag } from '../shared/session.service';
import { createGetSessionServerParamsSchema } from './getSession.schema';
import { getSessionServerService } from './getSession.service';
import { isAuthServerApiGetSessionParamsFor, type AuthServerApiGetSessionParamsFor, type getSessionPropsFor } from './getSession.types';

/**
 * Controller for server-side getSession operations with validation.
 *
 * @pure
 * @description Validates input using a dynamically generated Zod schema, then executes
 * the getSession service with the validated parameters. Uses Effect's Context layer
 * to access the authServer dependency and type guards for runtime type narrowing.
 *
 * @param params - Raw input parameters to validate and process
 * @returns Effect requiring SessionAuthServerService context, failing with validation or API errors,
 *          and succeeding with session/user data or null
 *
 * @example
 * ```typescript
 * import { Effect } from 'effect';
 * import { SessionAuthServerServiceTag } from '../shared/session.service';
 * import { getSessionServerController } from './getSession.controller';
 *
 * // Handle incoming request
 * const program = getSessionServerController({
 *   headers: request.headers
 * });
 *
 * // Provide the AuthServer dependency
 * const result = await Effect.runPromise(
 *   Effect.provideService(program, SessionAuthServerServiceTag, { authServer })
 * );
 *
 * if (result) {
 *   console.log('User:', result.user.email);
 * } else {
 *   console.log('Not authenticated');
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Error handling in controller
 * const program = getSessionServerController(rawInput).pipe(
 *   Effect.catchTag('SessionAuthServerInputError', (e) =>
 *     Effect.succeed({ error: 'validation_failed', message: e.message })
 *   ),
 *   Effect.catchTag('SessionAuthServerApiError', (e) =>
 *     Effect.succeed({ error: 'api_error', status: e.status })
 *   )
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Using with Express/Next.js route handler
 * export async function GET(request: Request) {
 *   const program = getSessionServerController({
 *     headers: request.headers
 *   });
 *
 *   try {
 *     const session = await Effect.runPromise(
 *       Effect.provideService(program, SessionAuthServerServiceTag, { authServer })
 *     );
 *
 *     if (session) {
 *       return Response.json({ user: session.user });
 *     }
 *     return Response.json({ error: 'Not authenticated' }, { status: 401 });
 *   } catch (error) {
 *     return Response.json({ error: 'Session check failed' }, { status: 500 });
 *   }
 * }
 * ```
 */
export const getSessionServerController: getSessionPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiGetSessionParamsFor<T>) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(SessionAuthServerServiceTag);
		const schema = yield* _(createGetSessionServerParamsSchema(authServer));

		// 1) Validate params input with Zod
		const parsed = schema.safeParse(params);

		if (!parsed.success) {
			const message = 'Invalid get session parameters';
			const cause = parsed.error;
			return yield* _(Effect.fail(new SessionAuthServerInputError(message, cause)));
		}

		if (!isAuthServerApiGetSessionParamsFor<T>(parsed.data)) {
			const message = 'Parsed data does not conform to expected get session parameters structure';
			return yield* _(Effect.fail(new SessionAuthServerInputError(message)));
		}

		// 2) Call the service with the validated params
		const result = yield* _(getSessionServerService(parsed.data));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
