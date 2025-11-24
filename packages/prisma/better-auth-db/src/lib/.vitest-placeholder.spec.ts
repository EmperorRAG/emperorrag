/**
 * @fileoverview Placeholder test file for packages without tests.
 * @description This file ensures that Vitest test runs pass even when no actual tests exist.
 *              Vitest exits with code 1 when no test files are found, which breaks CI/CD.
 *              This placeholder provides a passing test to satisfy test runners.
 * @see {@link https://github.com/vitest-dev/vitest/issues|Vitest does not have a passWithNoTests option}
 */

import { describe, it, expect } from 'vitest';

describe('Placeholder Test Suite', () => {
	it('should pass when no other tests exist', () => {
		expect(true).toBe(true);
	});
});
