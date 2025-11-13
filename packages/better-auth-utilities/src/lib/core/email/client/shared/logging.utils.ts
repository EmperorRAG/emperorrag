/**
 * Utility functions for logging testing with Effect.
 *
 * @description This module provides test helper utilities for logging
 * operations with Effect types.
 */

import { Effect } from 'effect';
import { expect } from 'vitest';

/**
 * Run an Effect expecting success.
 *
 * @description Helper to run an Effect and return its success value.
 * Throws if the Effect fails. Logging Effects should never fail.
 *
 * @template A - The success type
 * @template E - The error type
 *
 * @param effect - The Effect to run
 * @returns {Promise<A>} Promise resolving to the success value
 *
 * @example
 * ```typescript
 * const logEffect = createLogSuccess('Sign up')(logger, telemetry, featureFlags, metadata);
 * await runEffectSuccess(logEffect);
 * expect(logger.info).toHaveBeenCalled();
 * ```
 */
export const runEffectSuccess = async <A, E>(effect: Effect.Effect<A, E>): Promise<A> => {
	return Effect.runPromise(effect);
};

/**
 * Run an Effect expecting failure.
 *
 * @description Helper to run an Effect expecting it to fail and return the error.
 * Throws if the Effect succeeds. Logging Effects should never fail, so this
 * is primarily for testing error-handling paths.
 *
 * @template A - The success type
 * @template E - The error type
 *
 * @param effect - The Effect to run
 * @returns {Promise<E>} Promise resolving to the error value
 *
 * @example
 * ```typescript
 * const effect = Effect.fail(new Error('Test error'));
 * const error = await runEffectFailure(effect);
 * expect(error.message).toBe('Test error');
 * ```
 */
export const runEffectFailure = async <A, E>(effect: Effect.Effect<A, E>): Promise<E> => {
	try {
		await Effect.runPromise(effect);
		throw new Error('Expected Effect to fail, but it succeeded');
	} catch (error) {
		return error as E;
	}
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
 * const logEffect = createLogSuccess('Sign in')(logger, telemetry, featureFlags, metadata);
 * await expectEffectSuccess(logEffect, undefined);
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
 * of the expected type. Not typically used for logging Effects which never fail.
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
 * const effect = Effect.fail(new Error('Test'));
 * await expectEffectFailure(effect, Error);
 * ```
 */
export const expectEffectFailure = async <A, E>(effect: Effect.Effect<A, E>, expectedErrorConstructor: new (...args: any[]) => E): Promise<void> => {
	const error = await runEffectFailure(effect);
	expect(error).toBeInstanceOf(expectedErrorConstructor);
};
