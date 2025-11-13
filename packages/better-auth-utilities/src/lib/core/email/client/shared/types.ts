/**
 * Shared type definitions for email authentication operations.
 *
 * @description This module contains common type definitions used across all
 * email authentication operations (sign-up, sign-in, sign-out, etc.).
 * These types follow the Better Fetch response pattern and enable type-safe
 * discriminated union handling.
 */

import type { BetterFetchError } from '@better-fetch/fetch';

/**
 * Better Fetch success response.
 *
 * @pure
 * @description Represents a successful Better Fetch response where data is present
 * and error is null. Part of the discriminated union pattern.
 *
 * @template TData - The type of the success payload data
 */
export type FetchSuccess<TData> = Readonly<{ data: TData; error: null }>;

/**
 * Better Fetch failure response.
 *
 * @pure
 * @description Represents a failed Better Fetch response where data is null
 * and error is present. Part of the discriminated union pattern.
 *
 * @template TError - The type of the error payload
 */
export type FetchFailure<TError> = Readonly<{ data: null; error: TError }>;

/**
 * Better Fetch discriminated union response.
 *
 * @pure
 * @description Union type representing either success or failure from Better Fetch.
 * Enables type-safe pattern matching with type guards.
 *
 * @template TData - The type of the success payload data
 * @template TError - The type of the error payload
 *
 * @example
 * ```typescript
 * type MyResponse = FetchResponse<{ user: User }, BetterFetchError>;
 * // Either: { data: { user: User }, error: null }
 * // Or:     { data: null, error: BetterFetchError }
 * ```
 */
export type FetchResponse<TData, TError> = FetchSuccess<TData> | FetchFailure<TError>;

/**
 * Generic Better Auth error payload.
 *
 * @description Standard error payload shape returned by Better Auth API calls.
 * Extends BetterFetchError with additional metadata fields.
 */
export type BetterAuthErrorPayload = BetterFetchError & Readonly<Record<string, unknown>>;
