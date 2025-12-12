import type { AuthServerInputError } from '../../errors/authServer.error';
import type { AuthServerErrorDescriptor } from '../describe-error/describeError.types';

/**
 * @pure
 */
export const createAuthServerInvalidInputErrorDescriptor = (error: AuthServerInputError): AuthServerErrorDescriptor => ({
	_tag: 'AuthServerErrorDescriptor',
	authServerErrorType: error,
	code: 'invalid_input',
	message: error.message,
	cause: error.cause,
	status: 400,
});
