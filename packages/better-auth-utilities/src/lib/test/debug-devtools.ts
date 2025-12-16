import { DevTools } from "@effect/experimental";
import { NodeRuntime } from "@effect/platform-node";
import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";
import { z } from "zod";
import { formatZodErrorMessage } from "../pipeline/format-zod-error-message/formatZodErrorMessage";

// 1. Create a fake ZodError
const schema = z.object({
  username: z.string().min(5),
  age: z.number().min(18),
});

const result = schema.safeParse({ username: "bob", age: 10 });

if (result.success) {
  console.log("Validation succeeded unexpectedly");
  process.exit(1);
}

// 2. Create a program that uses your function
const program = pipe(
  // Call your function
  formatZodErrorMessage(result.error),
  // Log the result to see it in the terminal
  Effect.tap((message) => Effect.log(`Formatted Message: ${message}`)),
  // Add a span for the main program
  Effect.withSpan("Debug Program"),
);

// 3. Run it with DevTools
// This connects to the Effect DevTools extension via WebSocket
const DevToolsLive = DevTools.layer();

program.pipe(Effect.provide(DevToolsLive), NodeRuntime.runMain);
