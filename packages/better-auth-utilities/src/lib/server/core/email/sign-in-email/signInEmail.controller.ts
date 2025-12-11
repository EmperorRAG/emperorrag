import * as Effect from 'effect/Effect';
import { validateInputEffect } from 'packages/better-auth-utilities/src/lib/pipeline/zod-input-validator/zodInputValidator';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import { createAuthServerApiEndpointParamsSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { signInEmailServerService } from './signInEmail.service';
import { isAuthServerApiSignInEmailParamsFor, type AuthServerApiSignInEmailParamsFor, type signInEmailPropsFor } from './signInEmail.types';

export const signInEmailServerController: signInEmailPropsFor = (params: AuthServerApiSignInEmailParamsFor<AuthServerFor>) =>
	Effect.gen(function* (_) {
		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* _(
			validateInputEffect(
				createAuthServerApiEndpointParamsSchema(AuthServerApiEndpoints.signInEmail),
				params,
				isAuthServerApiSignInEmailParamsFor,
				'signInEmail'
			)
		);

		// 2) Call the service with the validated params
		const result = yield* _(signInEmailServerService(validatedParams));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
