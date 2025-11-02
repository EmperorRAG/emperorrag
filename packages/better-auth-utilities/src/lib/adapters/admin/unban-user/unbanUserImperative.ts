import { Effect } from 'effect';
import {
	AdapterContext,
	AdapterResponse,
	AdminUser,
	UnbanUserDependencies,
	UnbanUserOptions,
} from '../../../types/admin/admin.types.js';
import { unbanUser as unbanUserFunctional } from './unbanUserFunctional.js';

/**
 * Imperative wrapper that forwards to the Effect-based unbanUser implementation.
 */
export const unbanUser = async (
	dependencies: UnbanUserDependencies,
	options: UnbanUserOptions,
	context: AdapterContext
): Promise<AdapterResponse<AdminUser>> => {
	const program = unbanUserFunctional(dependencies)(options, context);
	return Effect.runPromise(program);
};
