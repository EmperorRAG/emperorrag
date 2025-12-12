import type { AuthServerApiError } from '../../errors/authServer.error';
import type { AuthServerErrorDescriptor } from '../describe-error/describeError.types';

/**
 * @pure
 */
export const createAuthServerUserAlreadyExistsErrorDescriptor = (error: AuthServerApiError): AuthServerErrorDescriptor => ({
	_tag: 'AuthServerErrorDescriptor',
	authServerErrorType: error,
	code: 'user_already_exists',
	message: error.message,
	status: 409,
	cause: error.cause,
});
