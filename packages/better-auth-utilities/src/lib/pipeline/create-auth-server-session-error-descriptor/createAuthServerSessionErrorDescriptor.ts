import type { AuthServerSessionError } from '../../errors/authServer.error';
import type { AuthServerErrorDescriptor } from '../describe-error/describeError.types';

/**
 * @pure
 */
export const createAuthServerSessionErrorDescriptor = (error: AuthServerSessionError): AuthServerErrorDescriptor => ({
	_tag: 'AuthServerErrorDescriptor',
	authServerErrorType: error,
	code: 'session_error',
	message: error.message,
	status: 401,
	cause: error.cause,
});
