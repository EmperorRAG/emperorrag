import * as Effect from 'effect/Effect';
import { createAuthSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiSignInEmailParamsFor, type AuthServerApiSignInEmailParamsFor, type signInEmailPropsFor } from './signInEmail.types';
import { validateInputEffect } from '../../shared/core.error';
import { signInEmailServerService } from './signInEmail.service';

export const signInEmailServerController: signInEmailPropsFor = (params: AuthServerApiSignInEmailParamsFor<AuthServerFor>) =>
	Effect.gen(function* (_) {
		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* _(
			validateInputEffect(createAuthSchema(AuthServerApiEndpoints.signInEmail), params, isAuthServerApiSignInEmailParamsFor, 'signInEmail')
		);

		// 2) Call the service with the validated params
		const result = yield* _(signInEmailServerService(validatedParams));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
