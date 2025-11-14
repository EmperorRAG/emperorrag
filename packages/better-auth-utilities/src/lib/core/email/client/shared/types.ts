/**
 * Shared type definitions for email authentication operations.
 *
 * @description This module contains common type definitions used across all
 * email authentication operations (sign-up, sign-in, sign-out, etc.).
 * These types follow the Better Fetch response pattern and enable type-safe
 * discriminated union handling.
 */

import type { BetterFetchError } from '@better-fetch/fetch';
import type { AuthClient } from '../../../../client.js';

/**
 * Better Fetch success response with optional plugin awareness.
 *
 * @pure
 * @description Represents a successful Better Fetch response where data is present
 * and error is null. Part of the discriminated union pattern. Optionally accepts an
 * AuthClient generic to enable plugin-aware payload types.
 *
 * @template TData - The type of the success payload data
 * @template TAuthClient - Optional AuthClient type for plugin-aware payloads (defaults to AuthClient)
 *
 * @example
 * ```typescript
 * // Generic usage (backward compatible)
 * type MySuccess = FetchSuccess<{ user: User }>;
 *
 * // Plugin-aware usage
 * type SignUpSuccess = FetchSuccess<SignUpSuccessPayload<MyAuthClient>, MyAuthClient>;
 * ```
 */
export type FetchSuccess<TData, TAuthClient extends AuthClient = AuthClient> = Readonly<{ data: TData; error: null }>;

/**
 * Better Fetch failure response with optional plugin awareness.
 *
 * @pure
 * @description Represents a failed Better Fetch response where data is null
 * and error is present. Part of the discriminated union pattern. Optionally accepts
 * an AuthClient generic for plugin-aware error payloads.
 *
 * @template TError - The type of the error payload
 * @template TAuthClient - Optional AuthClient type for plugin-aware errors (defaults to AuthClient)
 *
 * @example
 * ```typescript
 * // Generic usage (backward compatible)
 * type MyFailure = FetchFailure<BetterFetchError>;
 *
 * // Plugin-aware usage
 * type SignUpFailure = FetchFailure<SignUpErrorPayload, MyAuthClient>;
 * ```
 */
export type FetchFailure<TError, TAuthClient extends AuthClient = AuthClient> = Readonly<{ data: null; error: TError }>;

/**
 * Better Fetch discriminated union response with optional plugin awareness.
 *
 * @pure
 * @description Union type representing either success or failure from Better Fetch.
 * Enables type-safe pattern matching with type guards. Optionally accepts an AuthClient
 * generic to enable plugin-aware type inference for both success and error channels.
 *
 * @template TData - The type of the success payload data
 * @template TError - The type of the error payload
 * @template TAuthClient - Optional AuthClient type for plugin awareness (defaults to AuthClient)
 *
 * @example
 * ```typescript
 * // Generic usage (backward compatible)
 * type MyResponse = FetchResponse<{ user: User }, BetterFetchError>;
 * // Either: { data: { user: User }, error: null }
 * // Or:     { data: null, error: BetterFetchError }
 *
 * // Plugin-aware usage (captures twoFactor, organization fields, etc.)
 * type SignUpResponse = FetchResponse<
 *   SignUpSuccessPayload<MyAuthClient>,
 *   SignUpErrorPayload,
 *   MyAuthClient
 * >;
 * ```
 */
export type FetchResponse<TData, TError, TAuthClient extends AuthClient = AuthClient> = FetchSuccess<TData, TAuthClient> | FetchFailure<TError, TAuthClient>;

/**
 * Generic Better Auth error payload.
 *
 * @description Standard error payload shape returned by Better Auth API calls.
 * Extends BetterFetchError with additional metadata fields.
 */
export type BetterAuthErrorPayload = BetterFetchError & Readonly<Record<string, unknown>>;
