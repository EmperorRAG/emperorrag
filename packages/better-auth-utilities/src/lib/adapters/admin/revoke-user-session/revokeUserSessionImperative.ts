import { Effect } from 'effect';
import {
	AdapterContext,
	AdapterResponse,
	RevokeUserSessionDependencies,
	RevokeUserSessionOptions,
	RevokeUserSessionResult,
} from '../../../types/admin/admin.types.js';
import { revokeUserSession as revokeUserSessionFunctional } from './revokeUserSessionFunctional.js';

/**
 * Imperative wrapper that forwards to the Effect-based revokeUserSession implementation.
 */
export const revokeUserSession = async (
	dependencies: RevokeUserSessionDependencies,
	options: RevokeUserSessionOptions,
	context: AdapterContext
): Promise<AdapterResponse<RevokeUserSessionResult>> => {
	const program = revokeUserSessionFunctional(dependencies)(options, context);
	return Effect.runPromise(program);
};
