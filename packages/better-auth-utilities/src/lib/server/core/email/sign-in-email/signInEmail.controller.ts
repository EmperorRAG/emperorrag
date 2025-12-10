import * as Effect from 'effect/Effect';
import {
	createBaseSchema,
	withBody,
	emailRequiredSchema,
	rememberMeOptionalSchema,
	withOptionalHeaders,
} from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import { z } from 'zod';
import { pipe } from 'effect/Function';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiSignInEmailParamsFor, type AuthServerApiSignInEmailParamsFor, type signInEmailPropsFor } from './signInEmail.types';
import { validateInputEffect } from '../../shared/core.error';
import { signInEmailServerService } from './signInEmail.service';
import { AuthServerTag } from '../../../server.service';

export const signInEmailServerController: signInEmailPropsFor = (params: AuthServerApiSignInEmailParamsFor<AuthServerFor>) =>
	Effect.gen(function* (_) {
		const authServer = yield* _(AuthServerTag);

		const signInEmailBodySchema = z.object({
			email: emailRequiredSchema,
			password: z.string().min(1, 'Password is required'),
			rememberMe: rememberMeOptionalSchema,
		});

		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* _(
			validateInputEffect(
				Effect.succeed(pipe(createBaseSchema(), withBody(signInEmailBodySchema), withOptionalHeaders())),
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
