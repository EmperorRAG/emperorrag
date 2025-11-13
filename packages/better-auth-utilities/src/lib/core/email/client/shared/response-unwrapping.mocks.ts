/**
 * Mock implementations for response unwrapping utilities.
 *
 * @description This module provides mock implementations of response unwrapping
 * utilities for testing email authentication operations. Includes mock type guards,
 * unwrappers, error factories, and comprehensive response/error fixtures.
 */

import { Effect } from 'effect';
import type { FetchResponse, FetchSuccess, FetchFailure } from './types.js';
import { EmailAuthApiError } from '../email.error.js';

/**
 * Mock implementation of isFetchFailure type guard.
 *
 * @pure
 * @description Type guard that discriminates between success and error branches
 * of Better Fetch union type. Returns true when response represents a failure
 * (data is null, error is present).
 *
 * @template TData - The type of the success payload data
 * @template TError - The type of the error payload
 *
 * @param response - Better Fetch response to check
 * @returns {boolean} True if response is a failure, false if success
 *
 * @example
 * ```typescript
 * const success = mockSignUpSuccessResponse();
 * const failure = mockSignUpFailureResponse();
 *
 * mockIsFetchFailure(success); // => false
 * mockIsFetchFailure(failure); // => true
 * ```
 */
export const mockIsFetchFailure = <TData, TError>(response: FetchResponse<TData, TError>): response is FetchFailure<TError> => response.error !== null;

/**
 * Mock implementation of unwrapFetchResponse.
 *
 * @pure
 * @description Curried function that unwraps Better Fetch responses into Effect
 * error/success channels. Takes an error factory and returns a function that
 * processes responses.
 *
 * @template TError - The type of the fetch error
 * @template TDomainError - The type of the domain error (extends Error)
 *
 * @param errorFactory - Factory to create domain error from fetch error
 * @returns {<TData>(response: FetchResponse<TData, TError>) => Effect.Effect<TData, TDomainError>}
 *   Function that unwraps response into Effect
 *
 * @example
 * ```typescript
 * const unwrap = mockUnwrapFetchResponse((error) => new EmailAuthApiError(error.message));
 * const response = mockSignUpSuccessResponse();
 * const effect = unwrap(response);
 * // => Effect.succeed({ user: {...}, session: {...} })
 * ```
 */
export const mockUnwrapFetchResponse =
	<TError, TDomainError extends Error>(errorFactory: (error: TError) => TDomainError) =>
	<TData>(response: FetchResponse<TData, TError>): Effect.Effect<TData, TDomainError> =>
		mockIsFetchFailure(response) ? Effect.fail(errorFactory(response.error)) : Effect.succeed(response.data);

/**
 * Mock implementation of createApiErrorFactory.
 *
 * @pure
 * @description Factory function that creates operation-specific API error factories.
 * Returns a function that constructs EmailAuthApiError with formatted message.
 *
 * @param operationName - Human-readable operation name (e.g., 'Sign up', 'Sign in')
 * @returns {(error: { status?: number; message?: string } & Record<string, unknown>) => EmailAuthApiError}
 *   Error factory function
 *
 * @example
 * ```typescript
 * const createError = mockCreateApiErrorFactory('Sign up');
 * const error = createError({ status: 409, message: 'User already exists' });
 * // => EmailAuthApiError('Sign up failed: User already exists', 409, {...})
 * ```
 */
export const mockCreateApiErrorFactory =
	(operationName: string) =>
	(error: { status?: number; message?: string } & Record<string, unknown>): EmailAuthApiError =>
		new EmailAuthApiError(`${operationName} failed${error.message ? `: ${error.message}` : ''}`, error.status, error);

/**
 * Mock signUpEmail success response fixture.
 *
 * @description Provides a successful Better Fetch response for signUp.email() with
 * complete user and session data.
 *
 * @example
 * ```typescript
 * const response = mockSignUpSuccessResponse();
 * expect(response.data.user.id).toBe('user-123');
 * expect(response.error).toBeNull();
 * ```
 */
export const mockSignUpSuccessResponse = (): FetchSuccess<{
	user: {
		id: string;
		email: string;
		name: string;
		emailVerified: boolean;
		createdAt: Date;
		updatedAt: Date;
	};
	session: {
		id: string;
		userId: string;
		expiresAt: Date;
		token: string;
		ipAddress?: string;
		userAgent?: string;
	} | null;
}> => ({
	data: {
		user: {
			id: 'user-123',
			email: 'test@example.com',
			name: 'Test User',
			emailVerified: false,
			createdAt: new Date('2024-01-01T00:00:00Z'),
			updatedAt: new Date('2024-01-01T00:00:00Z'),
		},
		session: {
			id: 'session-456',
			userId: 'user-123',
			expiresAt: new Date('2024-12-31T23:59:59Z'),
			token: 'session-token-abc123',
			ipAddress: '127.0.0.1',
			userAgent: 'Mozilla/5.0',
		},
	},
	error: null,
});

/**
 * Mock signInEmail success response fixture.
 *
 * @description Provides a successful Better Fetch response for signIn.email() with
 * complete user and session data.
 *
 * @example
 * ```typescript
 * const response = mockSignInSuccessResponse();
 * expect(response.data.user.id).toBe('user-123');
 * ```
 */
export const mockSignInSuccessResponse = (): FetchSuccess<{
	user: {
		id: string;
		email: string;
		name: string;
		emailVerified: boolean;
		createdAt: Date;
		updatedAt: Date;
	};
	session: {
		id: string;
		userId: string;
		expiresAt: Date;
		token: string;
		ipAddress?: string;
		userAgent?: string;
	};
	requiresVerification?: boolean;
}> => ({
	data: {
		user: {
			id: 'user-123',
			email: 'test@example.com',
			name: 'Test User',
			emailVerified: true,
			createdAt: new Date('2024-01-01T00:00:00Z'),
			updatedAt: new Date('2024-01-01T00:00:00Z'),
		},
		session: {
			id: 'session-789',
			userId: 'user-123',
			expiresAt: new Date('2024-12-31T23:59:59Z'),
			token: 'session-token-xyz789',
			ipAddress: '127.0.0.1',
			userAgent: 'Mozilla/5.0',
		},
		requiresVerification: false,
	},
	error: null,
});

/**
 * Mock signOut success response fixture.
 *
 * @description Provides a successful Better Fetch response for signOut() with
 * minimal success indicator.
 *
 * @example
 * ```typescript
 * const response = mockSignOutSuccessResponse();
 * expect(response.data.success).toBe(true);
 * ```
 */
export const mockSignOutSuccessResponse = (): FetchSuccess<{
	success: boolean;
}> => ({
	data: {
		success: true,
	},
	error: null,
});

/**
 * Mock signUpEmail failure response fixture.
 *
 * @description Provides a failed Better Fetch response for signUp.email() with
 * error payload.
 *
 * @example
 * ```typescript
 * const response = mockSignUpFailureResponse();
 * expect(response.error.status).toBe(409);
 * expect(response.data).toBeNull();
 * ```
 */
export const mockSignUpFailureResponse = (): FetchFailure<{
	status: number;
	message: string;
	statusText: string;
}> => ({
	data: null,
	error: {
		status: 409,
		message: 'User already exists',
		statusText: 'Conflict',
	},
});

/**
 * Mock signInEmail failure response fixture.
 *
 * @description Provides a failed Better Fetch response for signIn.email() with
 * authentication error payload.
 *
 * @example
 * ```typescript
 * const response = mockSignInFailureResponse();
 * expect(response.error.status).toBe(401);
 * ```
 */
export const mockSignInFailureResponse = (): FetchFailure<{
	status: number;
	message: string;
	statusText: string;
}> => ({
	data: null,
	error: {
		status: 401,
		message: 'Invalid credentials',
		statusText: 'Unauthorized',
	},
});

/**
 * Mock signOut failure response fixture.
 *
 * @description Provides a failed Better Fetch response for signOut() with
 * session error payload.
 *
 * @example
 * ```typescript
 * const response = mockSignOutFailureResponse();
 * expect(response.error.status).toBe(401);
 * ```
 */
export const mockSignOutFailureResponse = (): FetchFailure<{
	status: number;
	message: string;
	statusText: string;
}> => ({
	data: null,
	error: {
		status: 401,
		message: 'Session not found',
		statusText: 'Unauthorized',
	},
});

/**
 * Mock API error payload - 401 Unauthorized.
 *
 * @description Provides error payload for 401 authentication failures.
 *
 * @example
 * ```typescript
 * const errorPayload = mockApiErrorPayload_401();
 * const error = mockCreateApiErrorFactory('Sign in')(errorPayload);
 * ```
 */
export const mockApiErrorPayload_401 = () => ({
	status: 401,
	message: 'Authentication failed',
	statusText: 'Unauthorized',
});

/**
 * Mock API error payload - 409 Conflict.
 *
 * @description Provides error payload for 409 resource conflict errors.
 *
 * @example
 * ```typescript
 * const errorPayload = mockApiErrorPayload_409();
 * const error = mockCreateApiErrorFactory('Sign up')(errorPayload);
 * ```
 */
export const mockApiErrorPayload_409 = () => ({
	status: 409,
	message: 'Resource already exists',
	statusText: 'Conflict',
});

/**
 * Mock API error payload - 500 Internal Server Error.
 *
 * @description Provides error payload for 500 server errors.
 *
 * @example
 * ```typescript
 * const errorPayload = mockApiErrorPayload_500();
 * const error = mockCreateApiErrorFactory('Sign in')(errorPayload);
 * ```
 */
export const mockApiErrorPayload_500 = () => ({
	status: 500,
	message: 'Internal server error',
	statusText: 'Internal Server Error',
});
