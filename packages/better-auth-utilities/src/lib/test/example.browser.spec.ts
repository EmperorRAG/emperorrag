import { Effect } from 'effect';
import { describe, expect, it } from 'vitest';
import { run, testEffect } from './effectTestHarness';

describe('Browser Effect Tests', () => {
	it('should have access to browser globals', async () => {
		await run(
			Effect.sync(() => {
				expect(typeof window).toBe('object');
				expect(typeof document).toBe('object');
			})
		);
	});

	testEffect('should run effect in browser environment', Effect.succeed('browser success'));

	it('should interact with DOM', async () => {
		await run(
			Effect.sync(() => {
				const div = document.createElement('div');
				div.textContent = 'Hello Effect';
				document.body.appendChild(div);
				expect(document.body.textContent).toContain('Hello Effect');
			})
		);
	});
});
