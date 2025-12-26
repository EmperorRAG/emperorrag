import { Effect, Layer, Logger, LogLevel } from "effect";
import * as ManagedRuntime from "effect/ManagedRuntime";
import { it } from "vitest";

export const TestLayer = Layer.mergeAll(
  Logger.minimumLogLevel(LogLevel.Warning),
);

export const makeTestRuntime = (
  layer: Layer.Layer<
    unknown,
    unknown,
    never
  > = TestLayer as unknown as Layer.Layer<unknown, unknown, never>,
) => {
  return ManagedRuntime.make(layer);
};

const defaultRuntime = makeTestRuntime();

export const run = <A, E>(
  effect: Effect.Effect<A, E, unknown>,
  options?: { runtime?: ManagedRuntime.ManagedRuntime<unknown, unknown> },
) => {
  const runtime = options?.runtime ?? defaultRuntime;
  return runtime.runPromise(effect);
};

export const runExit = <A, E>(
  effect: Effect.Effect<A, E, unknown>,
  options?: { runtime?: ManagedRuntime.ManagedRuntime<unknown, unknown> },
) => {
  const runtime = options?.runtime ?? defaultRuntime;
  return runtime.runPromiseExit(effect);
};

export const runEither = <A, E>(
  effect: Effect.Effect<A, E, unknown>,
  options?: { runtime?: ManagedRuntime.ManagedRuntime<unknown, unknown> },
) => {
  const runtime = options?.runtime ?? defaultRuntime;
  return runtime.runPromise(Effect.either(effect));
};

export const testEffect = <A, E>(
  name: string,
  effect: Effect.Effect<A, E, unknown>,
  timeout?: number,
) => {
  it(
    name,
    async () => {
      await run(effect);
    },
    timeout,
  );
};

export const provideTestLayer = <A, E, R>(
  effect: Effect.Effect<A, E, R>,
  layer: Layer.Layer<R, unknown, unknown>,
) => {
  return Effect.provide(effect, layer);
};
