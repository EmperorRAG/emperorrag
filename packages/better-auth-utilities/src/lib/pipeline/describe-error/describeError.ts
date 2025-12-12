import { pipe } from 'effect/Function';
import * as Match from 'effect/Match';
import type { AuthServerError, AuthServerErrorDescriptor } from '../../errors/authServer.error';

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
	);
