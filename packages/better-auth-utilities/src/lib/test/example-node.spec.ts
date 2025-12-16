import { Context, Effect, Layer } from 'effect';
import { describe, expect, it } from 'vitest';
import { run, runExit, testEffect } from './effectTestHarness';

// Define a test service
interface GreetingService {
	greet: (name: string) => Effect.Effect<string>;
}
const GreetingService = Context.GenericTag<GreetingService>('GreetingService');

// Default implementation
const GreetingServiceLive = Layer.succeed(GreetingService, {
	greet: (name) => Effect.succeed(`Hello, ${name}!`),
});

// Mock implementation
const GreetingServiceMock = Layer.succeed(GreetingService, {
	greet: (name) => Effect.succeed(`Mock Hello, ${name}!`),
});

describe('Node Effect Tests', () => {
	it('should run a simple effect', async () => {
		const result = await run(Effect.succeed(42));
		expect(result).toBe(42);
	});

	it('should handle typed errors with runExit', async () => {
		class MyError {
			readonly _tag = 'MyError';
		}
		const result = await runExit(Effect.fail(new MyError()));

		expect(result._tag).toBe('Failure');
		if (result._tag === 'Failure') {
			expect(result.cause._tag).toBe('Fail');
			// @ts-ignore
			expect(result.cause.error._tag).toBe('MyError');
		}
	});

	testEffect('should use testEffect helper', Effect.succeed('success'));

	it('should use dependency injection', async () => {
		const program = GreetingService.pipe(Effect.flatMap((service) => service.greet('World')));

		const result = await run(Effect.provide(program, GreetingServiceLive));
		expect(result).toBe('Hello, World!');
	});

	it('should allow layer overrides', async () => {
		const program = GreetingService.pipe(Effect.flatMap((service) => service.greet('World')));

		const result = await run(Effect.provide(program, GreetingServiceMock));
		expect(result).toBe('Mock Hello, World!');
	});
});
