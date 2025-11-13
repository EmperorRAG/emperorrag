/**
 * @fileoverview Unit tests for response unwrapping utilities
 * @module @emperorrag/better-auth-utilities/core/email/client/shared/response-unwrapping.spec
 * @description Tests for isFetchFailure, unwrapFetchResponse, and createApiErrorFactory functions
 */

import { describe, test, expect } from 'vitest';
import { Effect } from 'effect';
import { isFetchFailure, unwrapFetchResponse, createApiErrorFactory } from './response-unwrapping.js';
import {
	mockSignUpSuccessResponse,
	mockSignInSuccessResponse,
	mockSignOutSuccessResponse,
	mockSignUpFailureResponse,
	mockSignInFailureResponse,
	mockSignOutFailureResponse,
	mockApiErrorPayload_401,
	mockApiErrorPayload_409,
	mockApiErrorPayload_500,
} from './response-unwrapping.mocks.js';
import { runEffectSuccess, runEffectFailure } from './response-unwrapping.utils.js';

describe('isFetchFailure', () => {
	describe('with success responses', () => {
		test('returns false for signUp success response', () => {
			const response = mockSignUpSuccessResponse();
			const result = isFetchFailure(response);
			expect(result).toBe(false);
		});

		test('returns false for signIn success response', () => {
			const response = mockSignInSuccessResponse();
			const result = isFetchFailure(response);
			expect(result).toBe(false);
		});

		test('returns false for signOut success response', () => {
			const response = mockSignOutSuccessResponse();
			const result = isFetchFailure(response);
			expect(result).toBe(false);
		});

		test('verifies success response has data and null error', () => {
			const response = mockSignUpSuccessResponse();
			expect(response.data).toBeDefined();
			expect(response.error).toBeNull();
			expect(isFetchFailure(response)).toBe(false);
		});
	});

	describe('with failure responses', () => {
		test('returns true for signUp failure response', () => {
			const response = mockSignUpFailureResponse();
			const result = isFetchFailure(response);
			expect(result).toBe(true);
		});

		test('returns true for signIn failure response', () => {
			const response = mockSignInFailureResponse();
			const result = isFetchFailure(response);
			expect(result).toBe(true);
		});

		test('returns true for signOut failure response', () => {
			const response = mockSignOutFailureResponse();
			const result = isFetchFailure(response);
			expect(result).toBe(true);
		});

		test('verifies failure response has error and null data', () => {
			const response = mockSignUpFailureResponse();
			expect(response.error).toBeDefined();
			expect(response.data).toBeNull();
			expect(isFetchFailure(response)).toBe(true);
		});
	});

	describe('type guard behavior', () => {
		test('narrows type to failure when true', () => {
			const response = mockSignUpFailureResponse();
			if (isFetchFailure(response)) {
				// TypeScript should know response.error is not null
				expect(response.error).toBeDefined();
				expect(response.error.status).toBe(409);
			}
		});

		test('narrows type to success when false', () => {
			const response = mockSignUpSuccessResponse();
			if (!isFetchFailure(response)) {
				// TypeScript should know response.data is not null
				expect(response.data).toBeDefined();
				expect(response.data.user).toBeDefined();
			}
		});
	});
});

describe('unwrapFetchResponse', () => {
	describe('with success responses', () => {
		test('unwraps signUp success response', async () => {
			const response = mockSignUpSuccessResponse();
			const errorFactory = createApiErrorFactory('signUpEmail');
			const unwrap = unwrapFetchResponse(errorFactory);

			const result = await runEffectSuccess(unwrap(response));
			expect(result).toEqual(response.data);
			expect(result.user).toBeDefined();
			expect(result.session).toBeDefined();
		});

		test('unwraps signIn success response', async () => {
			const response = mockSignInSuccessResponse();
			const errorFactory = createApiErrorFactory('signInEmail');
			const unwrap = unwrapFetchResponse(errorFactory);

			const result = await runEffectSuccess(unwrap(response));
			expect(result).toEqual(response.data);
			expect(result.user).toBeDefined();
			expect(result.session).toBeDefined();
		});

		test('unwraps signOut success response', async () => {
			const response = mockSignOutSuccessResponse();
			const errorFactory = createApiErrorFactory('signOut');
			const unwrap = unwrapFetchResponse(errorFactory);

			const result = await runEffectSuccess(unwrap(response));
			expect(result).toEqual(response.data);
			expect(result.success).toBe(true);
		});

		test('preserves all response data properties', async () => {
			const response = mockSignInSuccessResponse();
			const errorFactory = createApiErrorFactory('signInEmail');
			const unwrap = unwrapFetchResponse(errorFactory);

			const result = await runEffectSuccess(unwrap(response));
			expect(result.user.id).toBe('user-123');
			expect(result.user.email).toBe('test@example.com');
			expect(result.session.token).toBe('session-token-xyz789');
			expect(result.requiresVerification).toBe(false);
		});
	});

	describe('with failure responses', () => {
		test('fails for signUp failure response', async () => {
			const response = mockSignUpFailureResponse();
			const errorFactory = createApiErrorFactory('signUpEmail');
			const unwrap = unwrapFetchResponse(errorFactory);

			const error = await runEffectFailure(unwrap(response));
			expect(error._tag).toBe('EmailAuthApiError');
			expect(error.status).toBe(409);
			expect(error.message).toContain('signUpEmail');
		});

		test('fails for signIn failure response', async () => {
			const response = mockSignInFailureResponse();
			const errorFactory = createApiErrorFactory('signInEmail');
			const unwrap = unwrapFetchResponse(errorFactory);

			const error = await runEffectFailure(unwrap(response));
			expect(error._tag).toBe('EmailAuthApiError');
			expect(error.status).toBe(401);
			expect(error.message).toContain('signInEmail');
		});

		test('fails for signOut failure response', async () => {
			const response = mockSignOutFailureResponse();
			const errorFactory = createApiErrorFactory('signOut');
			const unwrap = unwrapFetchResponse(errorFactory);

			const error = await runEffectFailure(unwrap(response));
			expect(error._tag).toBe('EmailAuthApiError');
			expect(error.status).toBe(401);
			expect(error.message).toContain('signOut');
		});

		test('includes operation name in error message', async () => {
			const response = mockSignUpFailureResponse();
			const errorFactory = createApiErrorFactory('Custom Operation');
			const unwrap = unwrapFetchResponse(errorFactory);

			const error = await runEffectFailure(unwrap(response));
			expect(error.message).toContain('Custom Operation');
		});
	});

	describe('error factory integration', () => {
		test('uses custom error factory for error creation', async () => {
			const response = mockSignUpFailureResponse();
			const errorFactory = createApiErrorFactory('Test Operation');
			const unwrap = unwrapFetchResponse(errorFactory);

			const error = await runEffectFailure(unwrap(response));
			expect(error.message).toContain('Test Operation');
			expect(error.status).toBe(409);
		});

		test('error factory preserves status code', async () => {
			const response = mockSignInFailureResponse();
			const errorFactory = createApiErrorFactory('testOp');
			const unwrap = unwrapFetchResponse(errorFactory);

			const error = await runEffectFailure(unwrap(response));
			expect(error.status).toBe(401);
		});
	});
});

describe('createApiErrorFactory', () => {
	describe('error message formatting', () => {
		test('creates error with 401 status', () => {
			const errorFactory = createApiErrorFactory('signInEmail');
			const error = errorFactory(mockApiErrorPayload_401());

			expect(error._tag).toBe('EmailAuthApiError');
			expect(error.status).toBe(401);
			expect(error.message).toContain('signInEmail');
		});

		test('creates error with 409 status', () => {
			const errorFactory = createApiErrorFactory('signUpEmail');
			const error = errorFactory(mockApiErrorPayload_409());

			expect(error._tag).toBe('EmailAuthApiError');
			expect(error.status).toBe(409);
			expect(error.message).toContain('signUpEmail');
		});

		test('creates error with 500 status', () => {
			const errorFactory = createApiErrorFactory('someOperation');
			const error = errorFactory(mockApiErrorPayload_500());

			expect(error._tag).toBe('EmailAuthApiError');
			expect(error.status).toBe(500);
			expect(error.message).toContain('someOperation');
		});

		test('includes operation name in message', () => {
			const errorFactory = createApiErrorFactory('My Custom Op');
			const error = errorFactory(mockApiErrorPayload_401());

			expect(error.message).toContain('My Custom Op');
		});

		test('formats message as "operationName failed: {message}"', () => {
			const errorFactory = createApiErrorFactory('testOp');
			const payload = mockApiErrorPayload_401();
			const error = errorFactory(payload);

			expect(error.message).toMatch(/testOp failed/);
			expect(error.message).toContain(payload.message);
		});
	});

	describe('error payload handling', () => {
		test('preserves error message from payload', () => {
			const errorFactory = createApiErrorFactory('op');
			const payload = mockApiErrorPayload_401();
			const error = errorFactory(payload);

			expect(error.message).toContain(payload.message);
		});

		test('preserves status code from payload', () => {
			const errorFactory = createApiErrorFactory('op');
			const payload = mockApiErrorPayload_409();
			const error = errorFactory(payload);

			expect(error.status).toBe(payload.status);
		});

		test('handles 401 Unauthorized payload', () => {
			const errorFactory = createApiErrorFactory('authOp');
			const payload = mockApiErrorPayload_401();
			const error = errorFactory(payload);

			expect(error.status).toBe(401);
			expect(error.message).toContain('Authentication failed');
		});

		test('handles 409 Conflict payload', () => {
			const errorFactory = createApiErrorFactory('createOp');
			const payload = mockApiErrorPayload_409();
			const error = errorFactory(payload);

			expect(error.status).toBe(409);
			expect(error.message).toContain('already exists');
		});

		test('handles 500 Internal Server Error payload', () => {
			const errorFactory = createApiErrorFactory('serverOp');
			const payload = mockApiErrorPayload_500();
			const error = errorFactory(payload);

			expect(error.status).toBe(500);
			expect(error.message).toContain('server error');
		});
	});

	describe('curried factory pattern', () => {
		test('returns function that creates errors', () => {
			const errorFactory = createApiErrorFactory('op');
			expect(typeof errorFactory).toBe('function');

			const error = errorFactory(mockApiErrorPayload_401());
			expect(error._tag).toBe('EmailAuthApiError');
		});

		test('can be reused for multiple errors', () => {
			const errorFactory = createApiErrorFactory('multiOp');

			const error1 = errorFactory(mockApiErrorPayload_401());
			const error2 = errorFactory(mockApiErrorPayload_409());
			const error3 = errorFactory(mockApiErrorPayload_500());

			expect(error1.status).toBe(401);
			expect(error2.status).toBe(409);
			expect(error3.status).toBe(500);

			expect(error1.message).toContain('multiOp');
			expect(error2.message).toContain('multiOp');
			expect(error3.message).toContain('multiOp');
		});

		test('each factory has independent operation name', () => {
			const factory1 = createApiErrorFactory('op1');
			const factory2 = createApiErrorFactory('op2');

			const error1 = factory1(mockApiErrorPayload_401());
			const error2 = factory2(mockApiErrorPayload_401());

			expect(error1.message).toContain('op1');
			expect(error2.message).toContain('op2');
		});
	});
});

describe('integration scenarios', () => {
	describe('complete unwrap flow', () => {
		test('success: type guard -> unwrap -> data', async () => {
			const response = mockSignUpSuccessResponse();

			// Type guard check
			expect(isFetchFailure(response)).toBe(false);

			// Unwrap
			const errorFactory = createApiErrorFactory('signUpEmail');
			const unwrap = unwrapFetchResponse(errorFactory);
			const result = await runEffectSuccess(unwrap(response));

			// Verify data
			expect(result.user).toBeDefined();
			expect(result.session).toBeDefined();
		});

		test('failure: type guard -> unwrap -> error', async () => {
			const response = mockSignInFailureResponse();

			// Type guard check
			expect(isFetchFailure(response)).toBe(true);

			// Unwrap
			const errorFactory = createApiErrorFactory('signInEmail');
			const unwrap = unwrapFetchResponse(errorFactory);
			const error = await runEffectFailure(unwrap(response));

			// Verify error
			expect(error._tag).toBe('EmailAuthApiError');
			expect(error.status).toBe(401);
		});
	});

	describe('different operation types', () => {
		test('handles signUp operation end-to-end', async () => {
			const successResp = mockSignUpSuccessResponse();
			const failureResp = mockSignUpFailureResponse();
			const errorFactory = createApiErrorFactory('signUpEmail');
			const unwrap = unwrapFetchResponse(errorFactory);

			const successResult = await runEffectSuccess(unwrap(successResp));
			expect(successResult.user.email).toBe('test@example.com');

			const failureError = await runEffectFailure(unwrap(failureResp));
			expect(failureError.status).toBe(409);
		});

		test('handles signIn operation end-to-end', async () => {
			const successResp = mockSignInSuccessResponse();
			const failureResp = mockSignInFailureResponse();
			const errorFactory = createApiErrorFactory('signInEmail');
			const unwrap = unwrapFetchResponse(errorFactory);

			const successResult = await runEffectSuccess(unwrap(successResp));
			expect(successResult.requiresVerification).toBe(false);

			const failureError = await runEffectFailure(unwrap(failureResp));
			expect(failureError.status).toBe(401);
		});

		test('handles signOut operation end-to-end', async () => {
			const successResp = mockSignOutSuccessResponse();
			const failureResp = mockSignOutFailureResponse();
			const errorFactory = createApiErrorFactory('signOut');
			const unwrap = unwrapFetchResponse(errorFactory);

			const successResult = await runEffectSuccess(unwrap(successResp));
			expect(successResult.success).toBe(true);

			const failureError = await runEffectFailure(unwrap(failureResp));
			expect(failureError.status).toBe(401);
		});
	});

	describe('error status code coverage', () => {
		test('handles all error status codes with proper formatting', async () => {
			const errorFactory = createApiErrorFactory('testOperation');

			const error401 = errorFactory(mockApiErrorPayload_401());
			const error409 = errorFactory(mockApiErrorPayload_409());
			const error500 = errorFactory(mockApiErrorPayload_500());

			expect(error401.status).toBe(401);
			expect(error409.status).toBe(409);
			expect(error500.status).toBe(500);

			expect(error401.message).toContain('testOperation');
			expect(error409.message).toContain('testOperation');
			expect(error500.message).toContain('testOperation');
		});
	});
});

describe('Effect type safety', () => {
	test('unwrapFetchResponse returns correct Effect types', async () => {
		const response = mockSignUpSuccessResponse();
		const errorFactory = createApiErrorFactory('testOp');
		const unwrap = unwrapFetchResponse(errorFactory);

		// TypeScript should infer Effect<TData, EmailAuthApiError>
		const effect = unwrap(response);
		const result = await Effect.runPromise(effect);
		expect(result).toBeDefined();
	});

	test('Effect success channel returns response data', async () => {
		const response = mockSignInSuccessResponse();
		const errorFactory = createApiErrorFactory('testOp');
		const unwrap = unwrapFetchResponse(errorFactory);

		const result = await runEffectSuccess(unwrap(response));
		expect(result).toEqual(response.data);
	});

	test('Effect failure channel returns EmailAuthApiError', async () => {
		const response = mockSignUpFailureResponse();
		const errorFactory = createApiErrorFactory('testOp');
		const unwrap = unwrapFetchResponse(errorFactory);

		const error = await runEffectFailure(unwrap(response));
		expect(error._tag).toBe('EmailAuthApiError');
	});
});
