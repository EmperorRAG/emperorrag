import * as Effect from 'effect/Effect';
import { createAuthSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiSignInSocialParamsFor, type AuthServerApiSignInSocialParamsFor, type signInSocialPropsFor } from './signInSocial.types';
import { validateInputEffect } from '../../shared/core.error';
import { signInSocialServerService } from './signInSocial.service';

/**
 * Server-side controller for OAuth social sign-in.
 *
 * @pure
 * @description Orchestrates the OAuth sign-in flow by combining the service with the AuthServer dependency.
 * This controller is responsible for wiring up the dependency injection and executing the service logic.
 * It serves as the entry point for the sign-in social operation in the application layer.
 *
 * @param params - The signInSocial parameters including provider, callbacks, and headers
 * @returns Effect requiring AuthServerFor context, failing with CoreAuthServerApiError,
 *          and succeeding with the sign-in result
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { AuthServerTag } from '../../../server.service';
 * import { signInSocialServerController } from './signInSocial.controller';
 *
 * // Execute the controller with parameters
 * const program = signInSocialServerController({
 *   body: {
 *     provider: 'google',
 *     callbackURL: '/dashboard'
 *   },
 *   headers: request.headers
 * });
 *
 * // Provide the AuthServer dependency and run
 * const result = await Effect.runPromise(
 *   Effect.provideService(program, AuthServerTag, authServer)
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Integration in a larger flow
 * const handleSocialLogin = (provider: string) =>
 *   signInSocialServerController({
 *     body: { provider },
 *     headers: getHeaders()
 *   }).pipe(
 *     Effect.tap((result) => Effect.log(`Social login initiated: ${JSON.stringify(result)}`)),
 *     Effect.provideService(AuthServerTag, authServer)
 *   );
 * ```
 */
export const signInSocialServerController: signInSocialPropsFor = (params: AuthServerApiSignInSocialParamsFor<AuthServerFor>) =>
	Effect.gen(function* (_) {
		const validatedParams = yield* _(
			validateInputEffect(
				createAuthSchema({
					body: z.object({
						provider: z.string(),
						callbackURL: z.string().optional(),
						errorCallbackURL: z.string().optional(),
						newUserCallbackURL: z.string().optional(),
						disableRedirect: z.boolean().optional(),
					}),
					headers: 'optional',
				}),
				params,
				isAuthServerApiSignInSocialParamsFor,
				'signInSocial'
			)
		);

		return yield* _(signInSocialServerService(validatedParams));
	});
