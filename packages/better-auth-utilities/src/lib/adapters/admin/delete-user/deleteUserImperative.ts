import { Effect } from 'effect';
import {
	AdapterContext,
	AdapterResponse,
	DeleteUserDependencies,
	DeleteUserResult,
} from '../../../types/admin/admin.types.js';
import { deleteUser as deleteUserFunctional } from './deleteUserFunctional.js';

/**
 * Imperative wrapper that forwards to the Effect-based deleteUser implementation.
 */
export const deleteUser = async (
	dependencies: DeleteUserDependencies,
	userId: string,
	context: AdapterContext
): Promise<AdapterResponse<DeleteUserResult>> => {
	const program = deleteUserFunctional(dependencies)(userId, context);
	return Effect.runPromise(program);
};
