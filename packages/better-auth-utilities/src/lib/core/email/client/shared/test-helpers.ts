/**
 * Centralized test helper utilities for email authentication testing.
 *
 * @description This module provides a composition factory that bundles all
 * mock utilities, fixtures, and helpers for easy test setup. Includes Effect
 * testing utilities and mock composition.
 */

import type { EmailAuthClientDeps } from '../email.types.js';
import {
	mockCreateValidator,
	mockCreateValidateDeps,
	mockAuthClient,
	mockFeatureFlags,
	mockValidDeps,
	mockInvalidDeps_MissingAuthClient,
	mockInvalidDeps_WrongAuthClientType,
	mockSignUpInput,
	mockSignInInput,
	mockSignOutOptions,
	mockInvalidSignUpInput_MissingEmail,
	mockInvalidSignInInput_MalformedEmail,
	mockInvalidSignOutOptions_NonFunctionCallback,
} from './validation.mocks.js';
import {
	mockIsFetchFailure,
	mockUnwrapFetchResponse,
	mockCreateApiErrorFactory,
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
import {
	mockLoggerWithSpies,
	mockTelemetryWithSpies,
	mockCreateLogValidationFailure,
	mockCreateLogApiFailure,
	mockCreateLogDataMissingFailure,
	mockCreateLogSessionFailure,
	mockCreateLogSuccess,
	verifyLoggerCalled,
	verifyTelemetryTracked,
	expectLoggerNotCalled,
	expectTelemetryNotTracked,
	mockValidationError_Deps,
	mockValidationError_Input,
	mockApiError_401,
	mockDataMissingError,
	mockSessionError,
} from './logging.mocks.js';
import {
	runEffectSuccess as validationRunEffectSuccess,
	runEffectFailure as validationRunEffectFailure,
	expectEffectSuccess as validationExpectEffectSuccess,
	expectEffectFailure as validationExpectEffectFailure,
} from './validation.utils.js';

/**
 * Unified Effect test helper exports.
 *
 * @description Re-exports Effect testing utilities with consistent naming.
 * All three module-specific utilities are re-exported as the same functions
 * since they have identical implementations.
 */
export {
	validationRunEffectSuccess as runEffectSuccess,
	validationRunEffectFailure as runEffectFailure,
	validationExpectEffectSuccess as expectEffectSuccess,
	validationExpectEffectFailure as expectEffectFailure,
};

/**
 * Composition factory for email authentication operation mocks.
 *
 * @description Creates a complete mock suite with all utilities configured.
 * Returns an object containing all dependencies, validators, unwrappers,
 * error factories, loggers, and fixtures needed for testing email operations.
 *
 * @template TAuthClient - The type of the auth client (defaults to AuthClient)
 *
 * @returns {Object} Complete mock suite
 *
 * @example
 * ```typescript
 * import { createAuthOperationMocks, mockSignUpInput, mockSignUpSuccessResponse } from '../shared/test-helpers';
 * import { signUpEmail } from './signUpEmail';
 *
 * const mocks = createAuthOperationMocks();
 *
 * // Configure mock behavior
 * mocks.authClient.signUp.email = vi.fn().mockResolvedValue(mockSignUpSuccessResponse());
 *
 * // Test operation
 * const signUpFn = signUpEmail(mocks.deps);
 * const result = await runEffectSuccess(signUpFn(mockSignUpInput()));
 *
 * // Verify results
 * expect(result.user.id).toBe('user-123');
 * expect(mocks.logger.info).toHaveBeenCalledWith(
 *   'Sign up completed successfully',
 *   expect.objectContaining({ userId: 'user-123' })
 * );
 * ```
 */
export const createAuthOperationMocks = <TAuthClient = any>() => {
	const authClient = mockAuthClient() as TAuthClient;
	const logger = mockLoggerWithSpies();
	const telemetry = mockTelemetryWithSpies();
	const featureFlags = mockFeatureFlags();

	const deps: EmailAuthClientDeps<any> = {
		authClient,
		logger,
		telemetry,
		featureFlags,
	} as any;

	return {
		// Core dependencies
		deps,
		authClient,
		logger,
		telemetry,
		featureFlags,

		// Validation mocks
		validateDeps: mockCreateValidateDeps<TAuthClient>,
		createValidator: mockCreateValidator,

		// Response unwrapping mocks
		isFetchFailure: mockIsFetchFailure,
		unwrapResponse: mockUnwrapFetchResponse,
		createApiError: mockCreateApiErrorFactory,

		// Logging mocks
		logValidation: mockCreateLogValidationFailure,
		logApi: mockCreateLogApiFailure,
		logData: mockCreateLogDataMissingFailure,
		logSession: mockCreateLogSessionFailure,
		logSuccess: mockCreateLogSuccess,

		// Verification utilities
		verifyLoggerCalled,
		verifyTelemetryTracked,
		expectLoggerNotCalled,
		expectTelemetryNotTracked,

		// Input fixtures
		fixtures: {
			validDeps: mockValidDeps<TAuthClient>,
			invalidDeps: {
				missingAuthClient: mockInvalidDeps_MissingAuthClient,
				wrongAuthClientType: mockInvalidDeps_WrongAuthClientType,
			},
			signUpInput: {
				valid: mockSignUpInput,
				invalid: {
					missingEmail: mockInvalidSignUpInput_MissingEmail,
				},
			},
			signInInput: {
				valid: mockSignInInput,
				invalid: {
					malformedEmail: mockInvalidSignInInput_MalformedEmail,
				},
			},
			signOutOptions: {
				valid: mockSignOutOptions,
				invalid: {
					nonFunctionCallback: mockInvalidSignOutOptions_NonFunctionCallback,
				},
			},
			responses: {
				signUp: {
					success: mockSignUpSuccessResponse,
					failure: mockSignUpFailureResponse,
				},
				signIn: {
					success: mockSignInSuccessResponse,
					failure: mockSignInFailureResponse,
				},
				signOut: {
					success: mockSignOutSuccessResponse,
					failure: mockSignOutFailureResponse,
				},
			},
			errors: {
				api: {
					_401: mockApiErrorPayload_401,
					_409: mockApiErrorPayload_409,
					_500: mockApiErrorPayload_500,
				},
				validation: {
					deps: mockValidationError_Deps,
					input: mockValidationError_Input,
				},
				domain: {
					api: mockApiError_401,
					dataMissing: mockDataMissingError,
					session: mockSessionError,
				},
			},
		},
	};
};

/**
 * Type export for mock suite.
 *
 * @description Exports the type of the mock suite returned by createAuthOperationMocks.
 * Useful for typing variables that store the mock suite.
 *
 * @example
 * ```typescript
 * let mocks: AuthOperationMockSuite<AuthClient>;
 *
 * beforeEach(() => {
 *   mocks = createAuthOperationMocks<AuthClient>();
 * });
 * ```
 */
export type AuthOperationMockSuite<TAuthClient = any> = ReturnType<typeof createAuthOperationMocks<TAuthClient>>;

// Re-export all mock utilities for direct imports
export * from './validation.mocks.js';
export * from './response-unwrapping.mocks.js';
export * from './logging.mocks.js';
export * from './validation.utils.js';
export * from './response-unwrapping.utils.js';
export * from './logging.utils.js';
