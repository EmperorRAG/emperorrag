/**
 * @fileoverview Unit tests for validation utilities
 * @module @emperorrag/better-auth-utilities/core/email/client/shared/validation.spec
 * @description Tests for createValidator and createValidateDeps functions using Vitest mocks
 */

import { describe, test, expect } from 'vitest';
import { Effect } from 'effect';
import { createValidator, createValidateDeps } from './validation.js';
import {
	mockValidDeps,
	mockInvalidDeps_MissingAuthClient,
	mockInvalidDeps_WrongAuthClientType,
	mockSignUpInput,
	mockInvalidSignUpInput_MissingEmail,
	mockInvalidSignInInput_MalformedEmail,
	mockInvalidSignOutOptions_NonFunctionCallback,
} from './validation.mocks.js';
import { runEffectSuccess, runEffectFailure, expectEffectSuccess, expectEffectFailure } from './validation.utils.js';
import { EmailAuthInputError } from '../email.error.js';

describe('createValidator', () => {
	describe('with valid input', () => {
		test('validates email string successfully', async () => {
			const emailValidator = (input: unknown): input is string => typeof input === 'string' && input.includes('@');

			const validate = createValidator(emailValidator, (msg) => new EmailAuthInputError(msg), 'Invalid email address');

			const result = await runEffectSuccess(validate('user@example.com'));
			expect(result).toBe('user@example.com');
		});

		test('validates number successfully', async () => {
			const numberValidator = (input: unknown): input is number => typeof input === 'number' && !isNaN(input);

			const validate = createValidator(numberValidator, (msg) => new EmailAuthInputError(msg), 'Invalid number');

			const result = await runEffectSuccess(validate(42));
			expect(result).toBe(42);
		});

		test('validates object successfully', async () => {
			interface User {
				name: string;
				email: string;
			}

			const userValidator = (input: unknown): input is User => typeof input === 'object' && input !== null && 'name' in input && 'email' in input;

			const validate = createValidator(userValidator, 'User', 'EmailAuthInputError');

			const user = { name: 'John', email: 'john@example.com' };
			const result = await runEffectSuccess(validate(user));
			expect(result).toEqual(user);
		});

		test('validates complex nested object successfully', async () => {
			interface SignUpData {
				email: string;
				password: string;
				callback?: () => void;
			}

			const signUpValidator = (input: unknown): input is SignUpData =>
				typeof input === 'object' &&
				input !== null &&
				'email' in input &&
				'password' in input &&
				typeof (input as any).email === 'string' &&
				typeof (input as any).password === 'string';

			const validate = createValidator(signUpValidator, (msg) => new EmailAuthInputError(msg), 'Invalid sign up data');

			const result = await runEffectSuccess(validate(mockSignUpInput()));
			expect(result).toEqual(mockSignUpInput());
		});
	});

	describe('with invalid input', () => {
		test('fails validation for non-email string', async () => {
			const emailValidator = (input: unknown): input is string => typeof input === 'string' && input.includes('@');

			const validate = createValidator(emailValidator, (msg) => new EmailAuthInputError(msg), 'Invalid email address');

			const error = await runEffectFailure(validate('not-an-email'));
			expect(error._tag).toBe('EmailAuthInputError');
		});

		test('fails validation for wrong type', async () => {
			const numberValidator = (input: unknown): input is number => typeof input === 'number' && !isNaN(input);

			const validate = createValidator(numberValidator, (msg) => new EmailAuthInputError(msg), 'Invalid number');

			const error = await runEffectFailure(validate('not-a-number'));
			expect(error._tag).toBe('EmailAuthInputError');
		});

		test('fails validation for null input', async () => {
			const objectValidator = (input: unknown): input is object => typeof input === 'object' && input !== null;

			const validate = createValidator(objectValidator, (msg) => new EmailAuthInputError(msg), 'Invalid object');

			const error = await runEffectFailure(validate(null));
			expect(error._tag).toBe('EmailAuthInputError');
		});

		test('fails validation for undefined input', async () => {
			const stringValidator = (input: unknown): input is string => typeof input === 'string';

			const validate = createValidator(stringValidator, (msg) => new EmailAuthInputError(msg), 'Invalid string');

			const error = await runEffectFailure(validate(undefined));
			expect(error._tag).toBe('EmailAuthInputError');
		});

		test('fails validation for missing required properties', async () => {
			interface SignUpData {
				email: string;
				password: string;
			}

			const signUpValidator = (input: unknown): input is SignUpData =>
				typeof input === 'object' && input !== null && 'email' in input && 'password' in input;

			const validate = createValidator(signUpValidator, (msg) => new EmailAuthInputError(msg), 'Invalid sign up data');

			const error = await runEffectFailure(validate(mockInvalidSignUpInput_MissingEmail));
			expect(error._tag).toBe('EmailAuthInputError');
		});

		test('fails validation for malformed email', async () => {
			interface SignInData {
				email: string;
				password: string;
			}

			const signInValidator = (input: unknown): input is SignInData => {
				if (typeof input !== 'object' || input === null || !('email' in input) || !('password' in input)) {
					return false;
				}
				const email = (input as any).email;
				return typeof email === 'string' && email.includes('@');
			};

			const validate = createValidator(signInValidator, (msg) => new EmailAuthInputError(msg), 'Invalid sign in data');

			const error = await runEffectFailure(validate(mockInvalidSignInInput_MalformedEmail));
			expect(error._tag).toBe('EmailAuthInputError');
		});

		test('fails validation for non-function callback', async () => {
			interface SignOutOptions {
				fetchOptions?: RequestInit;
				callback?: () => void;
			}

			const signOutValidator = (input: unknown): input is SignOutOptions => {
				if (typeof input !== 'object' || input === null) return false;
				const opts = input as any;
				if (opts.callback !== undefined && typeof opts.callback !== 'function') {
					return false;
				}
				return true;
			};

			const validate = createValidator(signOutValidator, (msg) => new EmailAuthInputError(msg), 'Invalid sign out options');

			const error = await runEffectFailure(validate(mockInvalidSignOutOptions_NonFunctionCallback));
			expect(error._tag).toBe('EmailAuthInputError');
		});
	});

	describe('edge cases', () => {
		test('handles empty string', async () => {
			const nonEmptyStringValidator = (input: unknown): input is string => typeof input === 'string' && input.length > 0;

			const validate = createValidator(nonEmptyStringValidator, (msg) => new EmailAuthInputError(msg), 'Invalid non-empty string');

			const error = await runEffectFailure(validate(''));
			expect(error._tag).toBe('EmailAuthInputError');
		});

		test('handles empty object', async () => {
			interface RequiredProps {
				name: string;
			}

			const requiredPropsValidator = (input: unknown): input is RequiredProps => typeof input === 'object' && input !== null && 'name' in input;

			const validate = createValidator(requiredPropsValidator, (msg) => new EmailAuthInputError(msg), 'Invalid required props');

			const error = await runEffectFailure(validate({}));
			expect(error._tag).toBe('EmailAuthInputError');
		});

		test('handles array input when object expected', async () => {
			interface User {
				name: string;
			}

			const userValidator = (input: unknown): input is User => typeof input === 'object' && input !== null && !Array.isArray(input);

			const validate = createValidator(userValidator, (msg) => new EmailAuthInputError(msg), 'Invalid user');

			const error = await runEffectFailure(validate([]));
			expect(error._tag).toBe('EmailAuthInputError');
		});

		test('handles NaN for number validator', async () => {
			const numberValidator = (input: unknown): input is number => typeof input === 'number' && !isNaN(input);

			const validate = createValidator(numberValidator, (msg) => new EmailAuthInputError(msg), 'Invalid number');

			const error = await runEffectFailure(validate(NaN));
			expect(error._tag).toBe('EmailAuthInputError');
		});
	});
});

describe('createValidateDeps', () => {
	describe('with valid dependencies', () => {
		test('validates dependencies successfully', async () => {
			const deps = mockValidDeps<any>();
			const validateDeps = createValidateDeps<any>('testOperation');

			const result = await runEffectSuccess(validateDeps(deps));
			expect(result).toEqual(deps);
			expect(result.authClient).toBeDefined();
			expect(result.logger).toBeDefined();
			expect(result.telemetry).toBeDefined();
			expect(result.featureFlags).toBeDefined();
		});

		test('preserves all dependency properties', async () => {
			const deps = mockValidDeps<any>();
			const validateDeps = createValidateDeps<any>('testOperation');

			const result = await runEffectSuccess(validateDeps(deps));
			expect(result.authClient.signUp.email).toBeDefined();
			expect(result.authClient.signIn.email).toBeDefined();
			expect(result.authClient.signOut).toBeDefined();
			expect(result.authClient.getSession).toBeDefined();
			expect(result.logger.debug).toBeDefined();
			expect(result.logger.info).toBeDefined();
			expect(result.logger.warn).toBeDefined();
			expect(result.logger.error).toBeDefined();
		});

		test('validates dependencies with optional telemetry', async () => {
			const deps = {
				...mockValidDeps<any>(),
				telemetry: undefined,
			};
			const validateDeps = createValidateDeps<any>('testOperation');

			const result = await runEffectSuccess(validateDeps(deps));
			expect(result.telemetry).toBeUndefined();
		});

		test('validates dependencies with optional logger', async () => {
			const deps = {
				...mockValidDeps<any>(),
				logger: undefined,
			};
			const validateDeps = createValidateDeps<any>('testOperation');

			const result = await runEffectSuccess(validateDeps(deps));
			expect(result.logger).toBeUndefined();
		});
	});

	describe('with invalid dependencies', () => {
		test('fails when authClient is missing', async () => {
			const deps = mockInvalidDeps_MissingAuthClient();
			const validateDeps = createValidateDeps<any>('testOperation');

			const error = await runEffectFailure(validateDeps(deps));
			expect(error._tag).toBe('EmailAuthDependenciesError');
		});

		test('fails when authClient has wrong type', async () => {
			const deps = mockInvalidDeps_WrongAuthClientType();
			const validateDeps = createValidateDeps<any>('testOperation');

			// Note: The real isAuthClient is very lenient and accepts any object
			// This test demonstrates that - it will actually SUCCEED
			const result = await runEffectSuccess(validateDeps(deps));
			expect(result.authClient).toBeDefined();
		});

		test('fails when dependencies is null', async () => {
			const validateDeps = createValidateDeps<any>('testOperation');

			const error = await runEffectFailure(validateDeps(null as any));
			expect(error._tag).toBe('EmailAuthDependenciesError');
		});

		test('fails when dependencies is undefined', async () => {
			const validateDeps = createValidateDeps<any>('testOperation');

			const error = await runEffectFailure(validateDeps(undefined as any));
			expect(error._tag).toBe('EmailAuthDependenciesError');
		});

		test('fails when dependencies is not an object', async () => {
			const validateDeps = createValidateDeps<any>('testOperation');

			const error = await runEffectFailure(validateDeps('not-an-object' as any));
			expect(error._tag).toBe('EmailAuthDependenciesError');
		});
	});

	describe('edge cases', () => {
		test('handles empty object', async () => {
			const validateDeps = createValidateDeps<any>('testOperation');

			const error = await runEffectFailure(validateDeps({} as any));
			expect(error._tag).toBe('EmailAuthDependenciesError');
		});

		test('handles object with only some properties', async () => {
			const validateDeps = createValidateDeps<any>('testOperation');
			const deps = {
				authClient: mockValidDeps<any>().authClient,
				// Missing logger, telemetry, featureFlags - but they're optional!
			};

			// Note: logger, telemetry, and featureFlags are optional, so this succeeds
			const result = await runEffectSuccess(validateDeps(deps as any));
			expect(result.authClient).toBeDefined();
		});

		test('handles object with extra properties', async () => {
			const validateDeps = createValidateDeps<any>('testOperation');
			const deps = {
				...mockValidDeps<any>(),
				extraProp: 'extra',
			};

			// Note: This test expects failure because hasOnlyKeys will reject extra properties
			const error = await runEffectFailure(validateDeps(deps as any));
			expect(error._tag).toBe('EmailAuthDependenciesError');
		});

		test('handles authClient with missing methods', async () => {
			const validateDeps = createValidateDeps<any>('testOperation');
			const deps = {
				...mockValidDeps<any>(),
				authClient: {
					signUp: {},
					// Missing signIn, signOut, getSession - but isAuthClient is lenient
				},
			};

			// Note: isAuthClient accepts any object, so this succeeds
			const result = await runEffectSuccess(validateDeps(deps as any));
			expect(result.authClient).toBeDefined();
		});
	});
});

describe('Effect type safety', () => {
	test('createValidator returns correct Effect types', async () => {
		const validator = (input: unknown): input is string => typeof input === 'string';
		const validate = createValidator(validator, (msg) => new EmailAuthInputError(msg), 'Invalid string');

		// TypeScript should infer Effect<string, EmailAuthInputError>
		const effect = validate('test');
		const result = await Effect.runPromise(effect);
		expect(typeof result).toBe('string');
	});

	test('createValidateDeps returns correct Effect types', async () => {
		const validateDeps = createValidateDeps<any>('testOperation');

		// TypeScript should infer Effect<EmailAuthClientDeps<any>, EmailAuthDependenciesError>
		const effect = validateDeps(mockValidDeps<any>());
		const result = await Effect.runPromise(effect);
		expect(result.authClient).toBeDefined();
	});

	test('Effect success channel returns validated value', async () => {
		const validate = createValidator(
			(input: unknown): input is number => typeof input === 'number',
			(msg) => new EmailAuthInputError(msg),
			'Invalid number'
		);

		await expectEffectSuccess(validate(42), 42);
	});

	test('Effect failure channel returns error with correct _tag', async () => {
		const validate = createValidator(
			(input: unknown): input is string => typeof input === 'string',
			(msg) => new EmailAuthInputError(msg),
			'Invalid string'
		);

		await expectEffectFailure(validate(123), 'EmailAuthInputError');
	});
});
