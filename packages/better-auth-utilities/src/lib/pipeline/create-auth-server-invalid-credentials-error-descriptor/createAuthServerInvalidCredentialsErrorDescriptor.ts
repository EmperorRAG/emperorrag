import type { AuthServerApiError } from '../../errors/authServer.error';
import type { AuthServerErrorDescriptor } from '../describe-error/describeError.types';

/**
 * @pure
 */
export const createAuthServerInvalidCredentialsErrorDescriptor = (error: AuthServerApiError): AuthServerErrorDescriptor => ({
	_tag: 'AuthServerErrorDescriptor',
	authServerErrorType: error,
	code: 'invalid_credentials',
	message: error.message,
	status: 401,
	cause: error.cause,
});
