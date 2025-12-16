# 3️⃣ Effect library: Testing features & how they fit _your_ rules

Now to the testing side — this is where Effect really shines **with your architecture**.

## Core testing primitives in Effect

### 1. `Effect.runPromise` / `Effect.runSync`

- Execute an Effect in tests
- Deterministic: no hidden async
- Ideal for unit tests of helpers, schemas, services

```ts
await Effect.runPromise(myEffect);
```

### 2. `Effect.exit`

- Observe **success vs failure** without throwing
- Critical for testing error cases

```ts
const exit = await Effect.runPromise(Effect.exit(effect));
expect(exit._tag).toBe("Failure");
```

This maps _perfectly_ to your rule “errors are values”.

---

## Testing Schemas (very relevant to you)

### Schema decoding tests

You can test schemas directly without controllers or services.

```ts
const result = Schema.decodeUnknownEither(SignUpEmailCommandSchema(authServer))(
  input,
);

expect(Either.isRight(result)).toBe(true);
```

Or for failures:

```ts
expect(Either.isLeft(result)).toBe(true);
```

This lets you test:

- required fields
- additionalFields behavior
- password policy enforcement
- ignored unknown keys

👉 **No mocks needed. No adapters needed.**

---

## Testing unary helpers (your adapter combinators)

Your helpers are ideal for unit testing because:

- unary
- deterministic
- Effect-returning

Example:

```ts
const effect = extractBodyStrict({ body: { foo: "bar" } });
const exit = await Effect.runPromise(Effect.exit(effect));

expect(exit._tag).toBe("Success");
```

And failure:

```ts
const effect = extractBodyStrict({});
const exit = await Effect.runPromise(Effect.exit(effect));

expect(exit._tag).toBe("Failure");
```

This aligns exactly with your strictness rules.

---

## Testing services with dependency injection

Because you use `Context.Tag` + `Layer`:

### 1. Provide a test layer

```ts
const TestAuthServerLayer = Layer.succeed(EmailAuthServerServiceTag, {
  authServer: fakeAuthServer,
});
```

### 2. Provide it to the Effect

```ts
const effect = signUpEmailServerServiceFromCommandWithCtx(cmd, ctx);

await Effect.runPromise(Effect.provide(effect, TestAuthServerLayer));
```

No mocks. No globals. No monkey-patching.

---

## Testing error mapping (critical for you)

Because errors are values:

```ts
const exit = await Effect.runPromise(Effect.exit(effect));

if (exit._tag === "Failure") {
  expect(exit.cause.error._tag).toBe("EmailAuthServerApiError");
}
```

You can test:

- API error mapping
- input error mapping
- missing body handling
- invalid headers handling

## Mental model to keep

### Your architecture + Effect testing = perfect fit

- Schemas → tested directly
- Adapters → tested as unary Effects
- Commands → data, no tests needed beyond schema
- Services → tested with Layers
- Controllers → thin orchestration, few tests needed
