import { Effect } from 'effect';
import {
	AdapterContext,
	AdapterResponse,
	AdminUser,
	UpdateUserDependencies,
	UpdateUserOptions,
} from '../../../types/admin/admin.types.js';
import { updateUser as updateUserFunctional } from './updateUserFunctional.js';

/**
 * Imperative wrapper that forwards to the Effect-based updateUser implementation.
 */
export const updateUser = async (
	dependencies: UpdateUserDependencies,
	options: UpdateUserOptions,
	context: AdapterContext
): Promise<AdapterResponse<AdminUser>> => {
	const program = updateUserFunctional(dependencies)(options, context);
	return Effect.runPromise(program);
};
