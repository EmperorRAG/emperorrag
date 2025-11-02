import { Effect } from 'effect';
import {
	AdapterContext,
	AdapterResponse,
	AdminUserSession,
	ImpersonateUserDependencies,
	ImpersonateUserOptions,
} from '../../../types/admin/admin.types.js';
import { impersonateUser as impersonateUserFunctional } from './impersonateUserFunctional.js';

/**
 * Imperative wrapper that forwards to the Effect-based impersonateUser implementation.
 */
export const impersonateUser = async (
	dependencies: ImpersonateUserDependencies,
	options: ImpersonateUserOptions,
	context: AdapterContext
): Promise<AdapterResponse<AdminUserSession>> => {
	const program = impersonateUserFunctional(dependencies)(options, context);
	return Effect.runPromise(program);
};
