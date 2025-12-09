/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/sign-in-social/signInSocial.controller.ts
 * @description Controller for signInSocial server operations with input validation.
 * Combines schema validation with service execution in a type-safe manner.
 */

import { Effect } from 'effect';
import type { AuthServerFor } from '../../../server.types';
import { OAuthAuthServerInputError } from '../shared/oauth.error';
import { OAuthAuthServerServiceTag } from '../shared/oauth.service';
import { createSignInSocialServerParamsSchema } from './signInSocial.schema';
import { signInSocialServerService } from './signInSocial.service';
import { isAuthServerApiSignInSocialParamsFor, type AuthServerApiSignInSocialParamsFor, type signInSocialPropsFor } from './signInSocial.types';

/**
 * Controller for server-side OAuth social sign-in operations with validation.
 *
 * @pure
 * @description Validates input using a dynamically generated Zod schema, then executes
 * the signInSocial service with the validated parameters. Uses Effect's Context layer
 * to access the authServer dependency and type guards for runtime type narrowing.
 *
 * @param params - Raw input parameters to validate and process
 * @returns Effect requiring OAuthAuthServerService context, failing with validation or API errors,
 *          and succeeding with the sign-in result
 *
 * @example
 * ```typescript
 * import { Effect } from 'effect';
 * import { OAuthAuthServerServiceTag } from '../shared/oauth.service';
 * import { signInSocialServerController } from './signInSocial.controller';
 *
 * // Handle incoming request
 * const program = signInSocialServerController({
 *   body: {
 *     provider: 'google',
 *     callbackURL: '/dashboard'
 *   },
 *   headers: request.headers
 * });
 *
 * // Provide the AuthServer dependency
 * const result = await Effect.runPromise(
 *   Effect.provideService(program, OAuthAuthServerServiceTag, { authServer })
 * );
 *
 * // Handle redirect
 * if ('url' in result) {
 *   return Response.redirect(result.url);
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Error handling in controller
 * const program = signInSocialServerController(rawInput).pipe(
 *   Effect.catchTag('OAuthAuthServerInputError', (e) =>
 *     Effect.succeed({ error: 'validation_failed', message: e.message })
 *   ),
 *   Effect.catchTag('OAuthAuthServerApiError', (e) =>
 *     Effect.succeed({ error: 'api_error', status: e.status })
 *   )
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Using with Express/Next.js route handler
 * export async function POST(request: Request) {
 *   const body = await request.json();
 *
 *   const program = signInSocialServerController({
 *     body,
 *     headers: request.headers
 *   });
 *
 *   try {
 *     const result = await Effect.runPromise(
 *       Effect.provideService(program, OAuthAuthServerServiceTag, { authServer })
 *     );
 *
 *     if ('url' in result) {
 *       return Response.json({ url: result.url });
 *     }
 *     return Response.json({ user: result.user });
 *   } catch (error) {
 *     return Response.json({ error: 'OAuth sign-in failed' }, { status: 500 });
 *   }
 * }
 * ```
 */
export const signInSocialServerController: signInSocialPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiSignInSocialParamsFor<T>) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(OAuthAuthServerServiceTag);
		const schema = yield* _(createSignInSocialServerParamsSchema(authServer));

		// 1) Validate params input with Zod
		const parsed = schema.safeParse(params);

		if (!parsed.success) {
			const message = 'Invalid OAuth sign-in parameters';
			const cause = parsed.error;
			return yield* _(Effect.fail(new OAuthAuthServerInputError(message, cause)));
		}

		if (!isAuthServerApiSignInSocialParamsFor<T>(parsed.data)) {
			const message = 'Parsed data does not conform to expected OAuth sign-in parameters structure';
			return yield* _(Effect.fail(new OAuthAuthServerInputError(message)));
		}

		// 2) Call the service with the validated params
		const result = yield* _(signInSocialServerService(parsed.data));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
