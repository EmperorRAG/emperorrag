import { Effect, Layer, Logger, LogLevel } from 'effect';
import * as ManagedRuntime from 'effect/ManagedRuntime';
import { it } from 'vitest';

export const TestLayer = Layer.mergeAll(Logger.minimumLogLevel(LogLevel.Warning));

export const makeTestRuntime = (layer: Layer.Layer<any, any, never> = TestLayer as any) => {
	return ManagedRuntime.make(layer);
};

const defaultRuntime = makeTestRuntime();

export const run = <A, E>(effect: Effect.Effect<A, E, any>, options?: { runtime?: ManagedRuntime.ManagedRuntime<any, any> }) => {
	const runtime = options?.runtime ?? defaultRuntime;
	return runtime.runPromise(effect);
};

export const runExit = <A, E>(effect: Effect.Effect<A, E, any>, options?: { runtime?: ManagedRuntime.ManagedRuntime<any, any> }) => {
	const runtime = options?.runtime ?? defaultRuntime;
	return runtime.runPromiseExit(effect);
};

export const runEither = <A, E>(effect: Effect.Effect<A, E, any>, options?: { runtime?: ManagedRuntime.ManagedRuntime<any, any> }) => {
	const runtime = options?.runtime ?? defaultRuntime;
	return runtime.runPromise(Effect.either(effect));
};

export const testEffect = <A, E>(name: string, effect: Effect.Effect<A, E, any>, timeout?: number) => {
	it(
		name,
		async () => {
			await run(effect);
		},
		timeout
	);
};

export const provideTestLayer = <A, E, R>(effect: Effect.Effect<A, E, R>, layer: Layer.Layer<R, any, any>) => {
	return Effect.provide(effect, layer);
};
