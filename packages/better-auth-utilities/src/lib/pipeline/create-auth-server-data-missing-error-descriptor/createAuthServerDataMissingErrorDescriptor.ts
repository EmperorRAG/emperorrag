import type { AuthServerDataMissingError } from '../../errors/authServer.error';
import type { AuthServerErrorDescriptor } from '../describe-error/describeError.types';

/**
 * @pure
 */
export const createAuthServerDataMissingErrorDescriptor = (error: AuthServerDataMissingError): AuthServerErrorDescriptor => ({
	_tag: 'AuthServerErrorDescriptor',
	authServerErrorType: error,
	code: 'data_missing',
	message: error.message,
	status: 500,
	cause: error.cause,
});
