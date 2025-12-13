import * as Effect from 'effect/Effect';
import { PipelineContext } from '../../../../context/pipeline.context';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import { extractBodyStrict, extractSignUpCtxStrict } from './signUpEmail.adapters';
import { decodeSignUpEmailCommand } from './signUpEmail.decoder';
import { signUpEmailServerServiceFromCommandWithCtx } from './signUpEmail.service';

export const signUpEmailServerController = (input: unknown) =>
	Effect.gen(function* () {
		const body = yield* extractBodyStrict(input);
		const ctx = yield* extractSignUpCtxStrict(input);
		const command = yield* decodeSignUpEmailCommand(body);

		return yield* signUpEmailServerServiceFromCommandWithCtx(command, ctx);
	}).pipe(
		Effect.provideService(PipelineContext, {
			endpoint: AuthServerApiEndpoints.SignUpEmail(),
		})
	);
