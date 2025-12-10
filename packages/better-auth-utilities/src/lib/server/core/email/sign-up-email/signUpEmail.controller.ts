import * as Effect from 'effect/Effect';
import {
	createAuthSchema,
	emailRequiredSchema,
	createPasswordSchema,
	nameRequiredSchema,
	imageURLOptionalSchema,
} from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiSignUpEmailParamsFor, type AuthServerApiSignUpEmailParamsFor, type signUpEmailPropsFor } from './signUpEmail.types';
import { validateInputEffect } from '../../shared/core.error';
import { signUpEmailServerService } from './signUpEmail.service';

export const signUpEmailServerController: signUpEmailPropsFor = (params: AuthServerApiSignUpEmailParamsFor<AuthServerFor>) =>
	Effect.gen(function* (_) {
		const signUpEmailBodySchema = z.object({
			email: emailRequiredSchema,
			password: createPasswordSchema(8, 128),
			name: nameRequiredSchema,
			image: imageURLOptionalSchema,
		});

		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* _(
			validateInputEffect(
				createAuthSchema({ body: signUpEmailBodySchema, headers: 'optional' }),
				params,
				isAuthServerApiSignUpEmailParamsFor,
				'signUpEmail'
			)
		);

		// 2) Call the service with the validated params
		const result = yield* _(signUpEmailServerService(validatedParams));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
