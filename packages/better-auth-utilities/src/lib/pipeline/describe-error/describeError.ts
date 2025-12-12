import { pipe } from 'effect/Function';
import * as Match from 'effect/Match';
import { AuthServerApiError, type AuthServerError } from '../../errors/authServer.error';
import type { AuthServerErrorDescriptor } from './describeError.types';

export const describeError = (error: AuthServerError): AuthServerErrorDescriptor =>
	pipe(
		Match.value(error),
		Match.tag('AuthServerInputError', (err) => ({
			_tag: 'AuthServerErrorDescriptor' as const,
			authServerErrorType: err,
			code: 'invalid_input' as const,
			message: err.message,
			cause: err.cause,
			status: 400,
		})),
		Match.tag('AuthServerApiError', (err) => {
			if (err.status === 401) {
				return {
					_tag: 'AuthServerErrorDescriptor' as const,
					authServerErrorType: err,
					code: 'invalid_credentials' as const,
					message: err.message,
					status: 401,
					cause: err.cause,
				};
			}
			if (err.status === 409) {
				return {
					_tag: 'AuthServerErrorDescriptor' as const,
					authServerErrorType: err,
					code: 'user_already_exists' as const,
					message: err.message,
					status: 409,
					cause: err.cause,
				};
			}
			return {
				_tag: 'AuthServerErrorDescriptor' as const,
				authServerErrorType: err,
				code: 'auth_server_error' as const,
				message: err.message,
				status: err.status ?? 500,
				cause: err.cause,
			};
		}),
		Match.tag('AuthServerSessionError', (err) => ({
			_tag: 'AuthServerErrorDescriptor' as const,
			authServerErrorType: err,
			code: 'session_error' as const,
			message: err.message,
			status: 401,
			cause: err.cause,
		})),
		Match.tag('AuthServerDependenciesError', (err) => ({
			_tag: 'AuthServerErrorDescriptor' as const,
			authServerErrorType: err,
			code: 'dependency_error' as const,
			message: err.message,
			status: 500,
			cause: err.cause,
		})),
		Match.tag('AuthServerDataMissingError', (err) => ({
			_tag: 'AuthServerErrorDescriptor' as const,
			authServerErrorType: err,
			code: 'data_missing' as const,
			message: err.message,
			status: 500,
			cause: err.cause,
		})),
		Match.exhaustive
	); /**
 * Helper to create a generic 500 error descriptor for unknown errors.
 */
export const createUnknownErrorDescriptor = (cause: unknown): AuthServerErrorDescriptor => {
	const error = new AuthServerApiError('An unexpected error occurred', 500, cause);
	return {
		_tag: 'AuthServerErrorDescriptor',
		authServerErrorType: error,
		code: 'auth_server_error',
		message: error.message,
		status: 500,
		cause,
	};
};
