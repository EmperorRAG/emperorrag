/**
 * Utility functions for response unwrapping testing with Effect.
 *
 * @description This module provides test helper utilities for response unwrapping
 * operations with Effect types.
 */

import { Effect } from 'effect';
import { expect } from 'vitest';

/**
 * Run an Effect expecting success.
 *
 * @description Helper to run an Effect and return its success value.
 * Throws if the Effect fails.
 *
 * @template A - The success type
 * @template E - The error type
 *
 * @param effect - The Effect to run
 * @returns {Promise<A>} Promise resolving to the success value
 *
 * @example
 * ```typescript
 * const effect = unwrapFetchResponse(errorFactory)(successResponse);
 * const result = await runEffectSuccess(effect);
 * expect(result.user.id).toBe('user-123');
 * ```
 */
export const runEffectSuccess = async <A, E>(effect: Effect.Effect<A, E>): Promise<A> => {
	return Effect.runPromise(effect);
};

/**
 * Run an Effect expecting failure.
 *
 * @description Helper to run an Effect expecting it to fail and return the error.
 * Uses Effect.flip to invert success/failure channels.
 *
 * @template A - The success type
 * @template E - The error type
 *
 * @param effect - The Effect to run
 * @returns {Promise<E>} Promise resolving to the error value
 *
 * @example
 * ```typescript
 * const effect = unwrapFetchResponse(errorFactory)(failureResponse);
 * const error = await runEffectFailure(effect);
 * expect(error).toBeInstanceOf(EmailAuthApiError);
 * ```
 */
export const runEffectFailure = async <A, E>(effect: Effect.Effect<A, E>): Promise<E> => {
	return Effect.runPromise(Effect.flip(effect));
};

/**
 * Assert an Effect succeeds with expected value.
 *
 * @description Helper to run an Effect and assert it succeeds with the expected value.
 *
 * @template A - The success type
 * @template E - The error type
 *
 * @param effect - The Effect to run
 * @param expectedValue - The expected success value
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const effect = unwrapFetchResponse(errorFactory)(successResponse);
 * await expectEffectSuccess(effect, expectedData);
 * ```
 */
export const expectEffectSuccess = async <A, E>(effect: Effect.Effect<A, E>, expectedValue: A): Promise<void> => {
	const result = await runEffectSuccess(effect);
	expect(result).toEqual(expectedValue);
};

/**
 * Assert an Effect fails with expected error type.
 *
 * @description Helper to run an Effect and assert it fails with an error
 * of the expected type.
 *
 * @template A - The success type
 * @template E - The error type
 *
 * @param effect - The Effect to run
 * @param expectedErrorConstructor - The expected error constructor
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const effect = unwrapFetchResponse(errorFactory)(failureResponse);
 * await expectEffectFailure(effect, EmailAuthApiError);
 * ```
 */
export const expectEffectFailure = async <A, E>(effect: Effect.Effect<A, E>, expectedErrorConstructor: new (...args: any[]) => E): Promise<void> => {
	const error = await runEffectFailure(effect);
	expect(error).toBeInstanceOf(expectedErrorConstructor);
};
