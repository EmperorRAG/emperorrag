import type { AuthServerDependenciesError } from '../../errors/authServer.error';
import type { AuthServerErrorDescriptor } from '../describe-error/describeError.types';

/**
 * @pure
 */
export const createAuthServerDependencyErrorDescriptor = (error: AuthServerDependenciesError): AuthServerErrorDescriptor => ({
	_tag: 'AuthServerErrorDescriptor',
	authServerErrorType: error,
	code: 'dependency_error',
	message: error.message,
	status: 500,
	cause: error.cause,
});
