/**
 * Utility functions for validation testing with Effect.
 *
 * @description This module provides test helper utilities for running and asserting
 * on Effect types, specifically for validation operations.
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
 * const effect = Effect.succeed(42);
 * const result = await runEffectSuccess(effect);
 * expect(result).toBe(42);
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
 * const effect = Effect.fail(new Error('Test error'));
 * const error = await runEffectFailure(effect);
 * expect(error.message).toBe('Test error');
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
 * const effect = Effect.succeed(42);
 * await expectEffectSuccess(effect, 42);
 * ```
 */
export const expectEffectSuccess = async <A, E>(effect: Effect.Effect<A, E>, expectedValue: A): Promise<void> => {
	const result = await runEffectSuccess(effect);
	expect(result).toEqual(expectedValue);
};

/**
 * Assert an Effect fails with expected error tag.
 *
 * @description Helper to run an Effect and assert it fails with an error
 * matching the expected _tag property (for discriminated union errors).
 *
 * @template A - The success type
 * @template E - The error type (must have _tag property)
 *
 * @param effect - The Effect to run
 * @param expectedErrorTag - The expected _tag value
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const effect = Effect.fail(new EmailAuthInputError('Invalid email'));
 * await expectEffectFailure(effect, 'EmailAuthInputError');
 * ```
 */
export const expectEffectFailure = async <A, E extends { _tag: string }>(effect: Effect.Effect<A, E>, expectedErrorTag: string): Promise<void> => {
	const error = await runEffectFailure(effect);
	expect(error._tag).toBe(expectedErrorTag);
};
