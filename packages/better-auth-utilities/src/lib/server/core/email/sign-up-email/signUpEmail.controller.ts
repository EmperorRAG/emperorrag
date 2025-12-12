import * as Effect from 'effect/Effect';
import { PipelineContext } from '../../../../context/pipeline.context';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import { validateInputEffect } from '../../../../pipeline/zod-input-validator/zodInputValidator';
import { createAuthServerApiEndpointParamsSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { signUpEmailServerService } from './signUpEmail.service';
import { isAuthServerApiSignUpEmailParamsFor, type AuthServerApiSignUpEmailParamsFor, type signUpEmailPropsFor } from './signUpEmail.types';

export const signUpEmailServerController: signUpEmailPropsFor = (params: AuthServerApiSignUpEmailParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* validateInputEffect(createAuthServerApiEndpointParamsSchema(), params, isAuthServerApiSignUpEmailParamsFor);

		// 2) Call the service with the validated params
		const result = yield* signUpEmailServerService(validatedParams);

		// 3) Return the success value of the whole controller Effect
		return result;
	}).pipe(
		Effect.provideService(PipelineContext, {
			endpoint: AuthServerApiEndpoints.signUpEmail,
		})
	);
