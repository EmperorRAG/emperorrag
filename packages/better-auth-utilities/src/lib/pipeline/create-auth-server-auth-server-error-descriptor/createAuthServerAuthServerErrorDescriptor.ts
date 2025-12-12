import type { AuthServerApiError } from '../../errors/authServer.error';
import type { AuthServerErrorDescriptor } from '../describe-error/describeError.types';

/**
 * @pure
 */
export const createAuthServerAuthServerErrorDescriptor = (error: AuthServerApiError): AuthServerErrorDescriptor => ({
	_tag: 'AuthServerErrorDescriptor',
	authServerErrorType: error,
	code: 'auth_server_error',
	message: error.message,
	status: error.status ?? 500,
	cause: error.cause,
});
