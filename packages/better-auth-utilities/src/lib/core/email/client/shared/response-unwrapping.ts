/**
 * Response unwrapping utilities for Better Fetch responses.
 *
 * @description This module provides utilities for unwrapping Better Fetch
 * discriminated union responses into Effect error/success channels.
 * Includes type guards, unwrapping functions, and error factory generators.
 */

import { Effect } from 'effect';
import type { EmailAuthError } from '../email.error.js';
import { EmailAuthApiError } from '../email.error.js';
import type { FetchResponse, FetchFailure } from './types.js';

/**
 * Type guard for Better Fetch failure responses.
 *
 * @pure
 * @description Discriminates between success and error branches of Better Fetch
 * union type `{ data: T, error: null } | { data: null, error: E }`. Returns true
 * when response represents a failure (data is null, error is present).
 *
 * @fp-pattern Type guard for discriminated union
 *
 * @template TData - The type of the success payload data
 * @template TError - The type of the error payload
 *
 * @param response - Better Fetch response to check
 * @returns {boolean} True if response is a failure, false if success
 *
 * @example
 * ```typescript
 * const success = { data: { user: {...} }, error: null };
 * const failure = { data: null, error: { message: 'Failed' } };
 *
 * isFetchFailure(success); // => false
 * isFetchFailure(failure); // => true
 * ```
 */
export const isFetchFailure = <TData, TError>(
	response: FetchResponse<TData, TError>
): response is FetchFailure<TError> => response.error !== null;

/**
 * Unwraps Better Fetch response into Effect channels.
 *
 * @pure
 * @description Higher-order function that unwraps Better Fetch discriminated union
 * `{ data: T, error: null } | { data: null, error: E }` into Effect's error and
 * success channels. Accepts an error factory to transform fetch errors into
 * domain-specific error types.
 *
 * @fp-pattern Higher-order function with error factory injection
 * @composition Composes `isFetchFailure` type guard with Effect constructors
 *
 * @template TError - The type of the fetch error payload
 * @template TDomainError - The type of the domain error (extends EmailAuthError)
 *
 * @param errorFactory - Factory function to create domain error from fetch error
 * @returns {(response: FetchResponse) => Effect.Effect<TData, TDomainError>}
 *   Function that unwraps response into Effect channels.
 *
 * @example
 * ```typescript
 * const unwrap = unwrapFetchResponse(
 *   (error) => new EmailAuthApiError('Operation failed', error.status, error)
 * );
 * const effect = unwrap({ data: { user: {...} }, error: null });
 * // => Effect.succeed({ user: {...} })
 *
 * const errorEffect = unwrap({ data: null, error: { message: 'Failed' } });
 * // => Effect.fail(new EmailAuthApiError(...))
 * ```
 */
export const unwrapFetchResponse =
	<TError, TDomainError extends EmailAuthError>(errorFactory: (error: TError) => TDomainError) =>
	<TData>(response: FetchResponse<TData, TError>): Effect.Effect<TData, TDomainError> =>
		isFetchFailure(response)
			? Effect.fail(errorFactory(response.error))
			: Effect.succeed(response.data);

/**
 * Generic factory for creating API error factories.
 *
 * @pure
 * @description Higher-order function that creates error factory functions for
 * specific operations. Returns a function that transforms Better Auth error
 * payloads into EmailAuthApiError instances with operation-specific messages.
 *
 * @fp-pattern Factory function for error factory creation
 *
 * @param operationName - Human-readable name of the operation (e.g., 'Sign in')
 * @returns {(error: ErrorPayload) => EmailAuthApiError}
 *   Factory function that creates EmailAuthApiError from error payload
 *
 * @example
 * ```typescript
 * const createSignInApiError = createApiErrorFactory('Sign in');
 * const error = createSignInApiError({ status: 401, message: 'Invalid credentials' });
 * // => EmailAuthApiError { message: 'Sign in failed: Invalid credentials', status: 401, ... }
 *
 * const createSignUpApiError = createApiErrorFactory('Sign up');
 * const error2 = createSignUpApiError({ status: 409, message: 'User exists' });
 * // => EmailAuthApiError { message: 'Sign up failed: User exists', status: 409, ... }
 * ```
 */
export const createApiErrorFactory =
	(operationName: string) =>
	(error: { status?: number; message?: string } & Record<string, unknown>): EmailAuthApiError =>
		new EmailAuthApiError(
			`${operationName} failed${error.message ? `: ${error.message}` : ''}`,
			error.status,
			error
		);
