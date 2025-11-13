/**
 * Validation utilities for email authentication operations.
 *
 * @description This module provides generic validation utilities for creating
 * type-safe validators with Effect error channels. Includes factory functions
 * for common validation patterns used across email authentication operations.
 */

import { Effect } from 'effect';
import type { AuthClient } from '../../../../client.js';
import type { EmailAuthClientDeps } from '../email.types.js';
import { isEmailAuthClientDeps } from '../email.types.js';
import { EmailAuthDependenciesError, type EmailAuthError } from '../email.error.js';

// Re-export isEmailAuthClientDeps for use in mocks
export { isEmailAuthClientDeps };

/**
 * Generic validator factory.
 *
 * @pure
 * @description Creates a validator function that uses a type guard to validate
 * input and returns an Effect with typed error channel. Follows the pattern:
 * `guard(input) ? Effect.succeed(input) : Effect.fail(errorFactory(message))`
 *
 * @fp-pattern Higher-order validation with Effect error channel
 *
 * @template TInput - The type of the validated input
 * @template TError - The type of the error (extends EmailAuthError)
 *
 * @param guard - Type guard function to validate input
 * @param errorFactory - Factory to create error from message
 * @param errorMessage - Error message when validation fails
 * @returns {(input: unknown) => Effect.Effect<TInput, TError>}
 *   Validator function that returns Effect with validated input or error
 *
 * @example
 * ```typescript
 * const validateEmail = createValidator(
 *   (input): input is string => typeof input === 'string' && input.includes('@'),
 *   (msg) => new EmailAuthInputError(msg),
 *   'Invalid email address'
 * );
 *
 * const effect1 = validateEmail('user@example.com');
 * // => Effect.succeed('user@example.com')
 *
 * const effect2 = validateEmail('invalid');
 * // => Effect.fail(new EmailAuthInputError('Invalid email address'))
 * ```
 */
export const createValidator =
	<TInput, TError extends EmailAuthError>(guard: (input: unknown) => input is TInput, errorFactory: (message: string) => TError, errorMessage: string) =>
	(input: unknown): Effect.Effect<TInput, TError> =>
		guard(input) ? Effect.succeed(input) : Effect.fail(errorFactory(errorMessage));

/**
 * Creates a validateDeps function for email auth operations.
 *
 * @pure
 * @description Factory function that creates operation-specific dependency
 * validators. Returns a validator that checks if input satisfies the
 * EmailAuthClientDeps contract with operation-specific error messages.
 *
 * @fp-pattern Specialized validator factory
 *
 * @template TAuthClient - The type of the auth client (extends AuthClient)
 *
 * @param operationName - Human-readable name of the operation (e.g., 'signInEmail')
 * @returns {(deps: unknown) => Effect.Effect<EmailAuthClientDeps<TAuthClient>, EmailAuthDependenciesError>}
 *   Validator function for email auth client dependencies
 *
 * @example
 * ```typescript
 * const validateSignInDeps = createValidateDeps<AuthClient>('signInEmail');
 * const effect = validateSignInDeps({ authClient, logger });
 * // => Effect.succeed({ authClient, logger })
 *
 * const validateSignUpDeps = createValidateDeps<AuthClient>('signUpEmail');
 * const effect2 = validateSignUpDeps({});
 * // => Effect.fail(new EmailAuthDependenciesError('Invalid dependencies provided to signUpEmail'))
 * ```
 */
export const createValidateDeps = <TAuthClient extends AuthClient>(operationName: string) =>
	createValidator<EmailAuthClientDeps<TAuthClient>, EmailAuthDependenciesError>(
		isEmailAuthClientDeps,
		(msg) => new EmailAuthDependenciesError(msg),
		`Invalid dependencies provided to ${operationName}`
	);
