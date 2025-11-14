/**
 * Shared utilities for email authentication operations.
 *
 * @description Barrel export for all shared utilities used across email
 * authentication operations (sign-up, sign-in, sign-out, etc.). Provides
 * type definitions, validation utilities, response unwrapping, and logging
 * factories that promote code reuse and consistency.
 *
 * @module shared
 */

// Type definitions
export type { FetchSuccess, FetchFailure, FetchResponse, BetterAuthErrorPayload } from './types.js';

// Response unwrapping utilities
export { isFetchFailure, unwrapFetchResponse, createApiErrorFactory } from './response-unwrapping.js';

// Validation utilities
export { createValidator, createValidateDeps } from './validation.js';
