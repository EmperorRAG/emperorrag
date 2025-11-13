# SignOut Implementation Analysis

**Date**: November 13, 2025
**Purpose**: Comprehensive analysis for implementing `signOut` following the FP decomposition pattern established by `signInEmail` and `signUpEmail`.

---

## 1. Better Auth API Analysis

### SignOut API Signature (from `better-auth/dist/shared/better-auth.BUpnjBGu.d.ts`)

```typescript
declare const signOut: {
    <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
        body?: undefined;  // ← NO BODY - signOut takes no input
    } & {
        method?: "POST" | undefined;
    } & {
        query?: Record<string, any> | undefined;
    } & {
        params?: Record<string, any>;
    } & {
        request?: Request;
    } & {
        headers: HeadersInit;
    } & {
        asResponse?: boolean;
        returnHeaders?: boolean;
        use?: better_call.Middleware[];
        path?: string;
    } & {
        asResponse?: AsResponse | undefined;
        returnHeaders?: ReturnHeaders | undefined;
    }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
        headers: Headers;
        response: {
            success: boolean;  // ← Returns only { success: boolean }
        };
    } : {
        success: boolean;
    }>;
    options: {
        method: "POST";
        requireHeaders: true;
        metadata: {
            openapi: {
                description: string;
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: { /* ... */ }
                            }
                        }
                    }
                }
            }
        }
    }
};
```

### Key Observations

1. **No Input Body**: `body?: undefined` - signOut does NOT accept credentials or data
2. **Void-Like Return**: Returns `{ success: boolean }` - minimal payload
3. **Method**: POST (same as signIn/signUp)
4. **Headers Required**: `requireHeaders: true` - session cookie required

### Better Auth Client API

The client exposes `authClient.signOut(options?)` where options are:

```typescript
type SignOutOptions = {
  all?: boolean;                    // Sign out all sessions or just current?
  redirectTo?: string;              // Client-side redirect after sign out
  fetchOptions?: {
    onSuccess?: () => void | Promise<void>;
    onError?: (error: unknown) => void | Promise<void>;
  };
};
```

**Important**: These options are CLIENT-SIDE options handled by Better Auth client wrapper, NOT sent to the server API.

---

## 2. Type Requirements

### Existing Types (from `email.types.ts`)

✅ **Already Exists**: `SignOutOptions`

```typescript
export type SignOutOptions = {
  all?: boolean;
  redirectTo?: string;
  fetchOptions?: Readonly<{
    onSuccess?: () => void | Promise<void>;
    onError?: (error: unknown) => void | Promise<void>;
  }>;
};
```

✅ **Already Exists**: `signOutProps<TAuthClient>`

```typescript
export interface signOutProps<TAuthClient extends AuthClient> {
  (deps: EmailAuthClientDeps<TAuthClient>):
    (options?: SignOutOptions) => Effect.Effect<void, EmailAuthError>;
}
```

✅ **Already Exists**: Type guard `isSignOutOptions`

```typescript
export const isSignOutOptions = (value: unknown): value is SignOutOptions | undefined =>
  pipe(
    value,
    Match.value,
    Match.when(isUndefined, () => true),
    Match.when(
      isRecord,
      (candidate) =>
        hasOnlyKeys(candidate, signOutKeys) &&
        isOptionalBoolean(candidate.all) &&
        isRedirectUrl(candidate.redirectTo) &&
        pipe(candidate.fetchOptions, (options) =>
          options === undefined || isSignOutFetchOptions(options))
    ),
    Match.orElse(() => false)
  );
```

### Internal Types Needed (NEW)

```typescript
// Internal payload type for Better Auth response
type SignOutSuccessPayload = Readonly<{
  success: boolean;
}>;

type SignOutErrorPayload = BetterFetchError & Readonly<Record<string, unknown>>;
```

**Note**: No user, no session, no data extraction needed.

---

## 3. Error Analysis

### Applicable Existing Errors

✅ **EmailAuthDependenciesError** - Used for deps validation (same as signIn/signUp)

✅ **EmailAuthInputError** - Used for options validation

- **Question**: Since `options` is optional (can be `undefined`), do we need this?
- **Answer**: YES - we still validate the shape when provided. Invalid options like `{ all: "yes" }` should fail.

✅ **EmailAuthApiError** - Used for API call failures (same as signIn/signUp)

❌ **EmailAuthDataMissingError** - NOT NEEDED (no data extraction)

❌ **EmailAuthSessionError** - NOT NEEDED (no session resolution)

### Sign-Out Specific Error Scenarios

1. **Invalid Dependencies**: `EmailAuthDependenciesError`
   - Missing authClient
   - Invalid logger/telemetry/featureFlags

2. **Invalid Options**: `EmailAuthInputError`
   - `{ all: "invalid" }` (should be boolean)
   - `{ fetchOptions: { onSuccess: "not a function" } }`
   - Unknown keys in options object

3. **API Failure**: `EmailAuthApiError`
   - Network failure
   - Server error (500)
   - Session not found (already signed out)
   - Invalid session token

4. **Callback Errors**: Handled via try-catch within logging layer
   - `onSuccess()` throws
   - `onError()` throws
   - Should NOT fail the Effect, just log warning

---

## 4. API Differences: signOut vs signIn/signUp

| Aspect | signIn/signUp | signOut |
|--------|---------------|---------|
| **Input** | Required (email, password, etc.) | Optional (SignOutOptions or undefined) |
| **Input Validation** | `isSignInEmailInput`, `isSignUpEmailInput` | `isSignOutOptions` (accepts undefined) |
| **API Body** | `{ email, password, ... }` | No body (empty or undefined) |
| **API Response** | User + session + flags | `{ success: boolean }` |
| **Data Extraction** | Extract user, session, flags | NO extraction (just unwrap) |
| **Session Resolution** | signUp needs fallback fetch | NOT NEEDED |
| **Result Type** | `SignInEmailResult<T>` or `SignUpEmailResult<T>` | `void` |
| **Result Builder** | `buildSignInResult`, `buildSignUpResult` | NOT NEEDED |
| **Callback Handling** | No callbacks | `onSuccess`, `onError` in fetchOptions |

---

## 5. Reusable Functions

### From signInEmail/signUpEmail (Reusable As-Is)

✅ **validateDeps** (Layer 1)

- Same signature for all auth functions
- Validates `EmailAuthClientDeps<TAuthClient>`

✅ **isFetchFailure** (Layer 3)

- Same type guard for Better Fetch responses
- Works for any `FetchResponse<TData, TError>`

✅ **unwrapFetchResponse** (Layer 3)

- Same higher-order function for response unwrapping
- Accepts error factory, works for any response type

### From signInEmail/signUpEmail (Needs Adaptation)

⚠️ **Validation Function** - Need new `validateSignOutOptions`

- signIn/signUp: `validateSignInInput`, `validateSignUpInput` - fail on invalid
- signOut: `validateSignOutOptions` - accepts undefined or valid options

⚠️ **API Call** - Need new `callSignOutApi`

- signIn/signUp: Pass input body
- signOut: Pass options (or empty)

⚠️ **Error Factory** - Need new `createSignOutApiError`

- Same pattern, different operation name

⚠️ **Logging Functions** - Need adapted versions

- Same patterns, different operation name
- Add callback-specific logging

### NOT Reusable (signOut Doesn't Need)

❌ **extractUserPayload** - No user in response
❌ **extractSessionFromResponse** - No session in response
❌ **extractSessionFromFetch** - No session fetch
❌ **requireSession** - No session validation
❌ **resolveSession** - No session resolution
❌ **extractRequiresVerification** - No verification flag
❌ **buildSignInResult** / **buildSignUpResult** - Returns void

---

## 6. New Functions Required

### Layer 1: Validation

```typescript
/**
 * Validates sign-out options payload.
 *
 * @pure
 * @fp-pattern Higher-order validation with Effect error channel
 *
 * @param options - Options payload to validate (can be undefined)
 * @returns {Effect.Effect<SignOutOptions | undefined, EmailAuthInputError>}
 *
 * @example
 * ```typescript
 * const validated = validateSignOutOptions({ all: true });
 * // => Effect.succeed({ all: true })
 *
 * const validated2 = validateSignOutOptions(undefined);
 * // => Effect.succeed(undefined)
 *
 * const validated3 = validateSignOutOptions({ all: "invalid" });
 * // => Effect.fail(new EmailAuthInputError('Invalid sign out options'))
 * ```
 */
export const validateSignOutOptions = (
  options: unknown
): Effect.Effect<SignOutOptions | undefined, EmailAuthInputError> =>
  isSignOutOptions(options)
    ? Effect.succeed(options)
    : Effect.fail(new EmailAuthInputError('Invalid sign out options'));
```

### Layer 2: API Call

```typescript
/**
 * Calls Better Auth sign-out API.
 *
 * @description Wraps the Better Auth client sign-out call in an Effect, converting
 * Promise rejections to typed EmailAuthApiError failures. Sign-out accepts optional
 * parameters but Better Auth client handles them internally.
 *
 * @param authClient - Better Auth client instance
 * @returns {Function} Curried function accepting optional sign-out options
 *
 * @example
 * ```typescript
 * const program = pipe(
 *   validateSignOutOptions(options),
 *   Effect.flatMap(callSignOutApi(authClient))
 * );
 * ```
 */
export const callSignOutApi =
  <TAuthClient extends AuthClient>(authClient: TAuthClient) =>
  (
    options?: SignOutOptions
  ): Effect.Effect<
    FetchResponse<SignOutSuccessPayload, SignOutErrorPayload>,
    EmailAuthApiError
  > =>
    Effect.tryPromise({
      try: () =>
        authClient.signOut(options) as Promise<
          FetchResponse<SignOutSuccessPayload, SignOutErrorPayload>
        >,
      catch: (error) =>
        new EmailAuthApiError('Sign out API call failed', undefined, error),
    });
```

### Layer 3: Error Factory

```typescript
/**
 * Creates EmailAuthApiError from sign-out error payload.
 *
 * @pure
 * @description Factory function for creating typed API errors with status codes.
 *
 * @param error - Better Auth sign-out error payload
 * @returns {EmailAuthApiError}
 */
export const createSignOutApiError = (
  error: SignOutErrorPayload
): EmailAuthApiError =>
  new EmailAuthApiError('Sign out failed', error.status, error);
```

### Layer 4: NO Payload Extraction (Returns void)

**Not needed** - signOut returns `{ success: boolean }` but we don't use it.
We only care that the API call succeeded (no error thrown).

### Layer 5: Callback Execution

```typescript
/**
 * Executes onSuccess callback if provided in fetchOptions.
 *
 * @description Fire-and-forget side effect for executing user-provided success callback.
 * Catches and logs any errors from the callback without failing the Effect pipeline.
 *
 * @param logger - Optional logger instance
 * @param options - Sign-out options containing fetchOptions
 * @returns {Effect.Effect<void, never>} Always succeeds, never fails
 *
 * @example
 * ```typescript
 * const program = pipe(
 *   unwrappedResponse,
 *   Effect.flatMap(() => executeOnSuccessCallback(logger, options))
 * );
 * ```
 */
export const executeOnSuccessCallback = (
  logger: EmailAuthClientDeps['logger'],
  options?: SignOutOptions
): Effect.Effect<void, never> =>
  Effect.sync(() => {
    const callback = options?.fetchOptions?.onSuccess;
    if (!callback) return;

    try {
      const result = callback();
      // Handle both sync and async callbacks
      if (result instanceof Promise) {
        void result.catch((error) => {
          logger?.warn('signOut onSuccess callback failed', { error });
        });
      }
    } catch (error) {
      logger?.warn('signOut onSuccess callback failed', { error });
    }
  });

/**
 * Executes onError callback if provided in fetchOptions.
 *
 * @description Fire-and-forget side effect for executing user-provided error callback.
 * Catches and logs any errors from the callback without failing the Effect pipeline.
 *
 * @param logger - Optional logger instance
 * @param options - Sign-out options containing fetchOptions
 * @param error - The error that triggered this callback
 * @returns {Effect.Effect<void, never>} Always succeeds, never fails
 */
export const executeOnErrorCallback = (
  logger: EmailAuthClientDeps['logger'],
  options: SignOutOptions | undefined,
  error: EmailAuthError
): Effect.Effect<void, never> =>
  Effect.sync(() => {
    const callback = options?.fetchOptions?.onError;
    if (!callback) return;

    try {
      const result = callback(error);
      // Handle both sync and async callbacks
      if (result instanceof Promise) {
        void result.catch((cbError) => {
          logger?.warn('signOut onError callback failed', { error: cbError });
        });
      }
    } catch (cbError) {
      logger?.warn('signOut onError callback failed', { error: cbError });
    }
  });
```

### Layer 6: Logging

```typescript
/**
 * Logs validation failure.
 *
 * @description Fire-and-forget side effect for logging validation errors.
 *
 * @param logger - Optional logger instance
 * @param error - Validation error
 */
export const logValidationFailure = (
  logger: EmailAuthClientDeps['logger'],
  error: EmailAuthDependenciesError | EmailAuthInputError
): void => {
  logger?.error('signOut validation failed', { error });
};

/**
 * Logs and tracks API failure.
 *
 * @description Fire-and-forget side effects for logging and telemetry on API errors.
 * Also executes the onError callback if provided.
 *
 * @param logger - Optional logger instance
 * @param telemetry - Optional telemetry instance
 * @param featureFlags - Optional feature flags for context
 * @param options - Sign-out options (may contain onError callback)
 * @param error - API error with status
 */
export const logApiFailure = (
  logger: EmailAuthClientDeps['logger'],
  telemetry: EmailAuthClientDeps['telemetry'],
  featureFlags: EmailAuthClientDeps['featureFlags'],
  options: SignOutOptions | undefined,
  error: EmailAuthApiError
): void => {
  logger?.error('signOut failed', { error });
  void telemetry?.trackEvent('signOut.failed', {
    errorStatus: error.status,
    errorMessage: error.message,
    featureFlags,
  });
};

/**
 * Logs and tracks successful sign-out.
 *
 * @description Fire-and-forget side effects for logging and telemetry on success.
 *
 * @param logger - Optional logger instance
 * @param telemetry - Optional telemetry instance
 * @param featureFlags - Optional feature flags for context
 * @param signedOutAll - Whether all sessions were signed out
 */
export const logSignOutSuccess = (
  logger: EmailAuthClientDeps['logger'],
  telemetry: EmailAuthClientDeps['telemetry'],
  featureFlags: EmailAuthClientDeps['featureFlags'],
  signedOutAll: boolean
): void => {
  logger?.info('signOut succeeded', { all: signedOutAll });
  void telemetry?.trackEvent('signOut.success', {
    all: signedOutAll,
    featureFlags,
  });
};
```

---

## 7. Layer Decomposition Strategy

### Layer Architecture (Simpler than signIn/signUp)

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 8: Pipeline (Effect.gen Orchestration)               │
│   - Composes layers 1-7 into single Effect pipeline        │
│   - Handles error tapError for logging at each step        │
│   - Returns Effect.Effect<void, EmailAuthError>            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 7: NO Result Builder                                 │
│   - Not needed (returns void)                               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 6: Logging & Telemetry                               │
│   - logValidationFailure                                    │
│   - logApiFailure                                           │
│   - logSignOutSuccess                                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 5: Callback Execution                                │
│   - executeOnSuccessCallback (safe, never fails)           │
│   - executeOnErrorCallback (safe, never fails)             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 4: NO Payload Extraction                             │
│   - Not needed (no user, no session)                        │
│   - Just unwrap response to validate success               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: Response Unwrapping                               │
│   - isFetchFailure (reused)                                 │
│   - unwrapFetchResponse (reused)                            │
│   - createSignOutApiError (new)                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: API Call                                          │
│   - callSignOutApi (new)                                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: Validation                                        │
│   - validateDeps (reused)                                   │
│   - validateSignOutOptions (new)                            │
└─────────────────────────────────────────────────────────────┘
```

### Function Count Comparison

| Operation | Total Functions | New Functions | Reused Functions |
|-----------|----------------|---------------|------------------|
| signUpEmail | 20+ | 20+ | 0 (first implementation) |
| signInEmail | 15 | ~8 | ~7 (from signUp) |
| signOut | 11 | ~6 | ~5 (from signIn/signUp) |

**signOut is simpler** because:

- No user extraction
- No session extraction
- No session resolution
- No result builder
- Just validate → call → unwrap → log → execute callbacks → return void

---

## 8. Callback Handling Strategy

### Question: Execute Callbacks Within Effect Pipeline or After?

**Answer: WITHIN the Effect pipeline, but safely wrapped**

### Rationale

1. **Better Auth Client Behavior**: Better Auth client already executes these callbacks internally, but we're wrapping the client call in Effect. We need to respect the callback contract.

2. **Error Isolation**: Callbacks are user-provided code that can throw. We MUST NOT let callback errors fail the sign-out operation.

3. **FP Pattern**: Use Effect.sync with try-catch to execute callbacks as side effects that never fail the pipeline.

### Implementation Pattern

```typescript
// In the pipeline:
yield* pipe(
  unwrappedResponse,
  Effect.flatMap(() => executeOnSuccessCallback(logger, options))
);

// Safe callback execution (never throws to Effect):
export const executeOnSuccessCallback = (
  logger: EmailAuthClientDeps['logger'],
  options?: SignOutOptions
): Effect.Effect<void, never> =>  // ← never fails
  Effect.sync(() => {
    const callback = options?.fetchOptions?.onSuccess;
    if (!callback) return;

    try {
      const result = callback();
      if (result instanceof Promise) {
        void result.catch((error) => {
          logger?.warn('signOut onSuccess callback failed', { error });
        });
      }
    } catch (error) {
      logger?.warn('signOut onSuccess callback failed', { error });
    }
  });
```

### Callback Execution Flow

```
Success Path:
API Success → executeOnSuccessCallback → logSuccess → Return void

Error Path:
API Error → logApiFailure (includes executeOnErrorCallback) → Fail with error
```

**Note**: `onError` is executed WITHIN `logApiFailure`, not as a separate step, to ensure it runs before the Effect fails.

---

## 9. Complete Implementation Plan

### File Structure

```
packages/better-auth-utilities/src/lib/core/email/client/
├── email.ts                     # Export signOut
├── email.types.ts               # Already has types
├── email.error.ts               # Already has errors
└── sign-out/
    └── signOut.ts               # New implementation
```

### Step-by-Step Implementation

#### Step 1: Create Type Definitions (NEW)

```typescript
// In sign-out/signOut.ts (top of file)

// ============================================================================
// Type Definitions
// ============================================================================

type FetchSuccess<TData> = Readonly<{ data: TData; error: null }>;
type FetchFailure<TError> = Readonly<{ data: null; error: TError }>;
type FetchResponse<TData, TError> = FetchSuccess<TData> | FetchFailure<TError>;

type SignOutSuccessPayload = Readonly<{
  success: boolean;
}>;

type SignOutErrorPayload = BetterFetchError & Readonly<Record<string, unknown>>;
```

#### Step 2: Implement Layer 1 - Validation (1 new function)

```typescript
// ============================================================================
// Layer 1: Validation
// ============================================================================

/**
 * Validates email auth client dependencies.
 * REUSED from signInEmail/signUpEmail - import or copy
 */
export const validateDeps = <TAuthClient extends AuthClient>(
  deps: unknown
): Effect.Effect<EmailAuthClientDeps<TAuthClient>, EmailAuthDependenciesError> =>
  isEmailAuthClientDeps<TAuthClient>(deps)
    ? Effect.succeed(deps)
    : Effect.fail(
        new EmailAuthDependenciesError(
          'Invalid dependencies provided to signOut'
        )
      );

/**
 * Validates sign-out options payload.
 * NEW - specific to signOut
 */
export const validateSignOutOptions = (
  options: unknown
): Effect.Effect<SignOutOptions | undefined, EmailAuthInputError> =>
  isSignOutOptions(options)
    ? Effect.succeed(options)
    : Effect.fail(new EmailAuthInputError('Invalid sign out options'));
```

#### Step 3: Implement Layer 2 - API Call (1 new function)

```typescript
// ============================================================================
// Layer 2: API Call
// ============================================================================

/**
 * Calls Better Auth sign-out API.
 * NEW - specific to signOut
 */
export const callSignOutApi =
  <TAuthClient extends AuthClient>(authClient: TAuthClient) =>
  (
    options?: SignOutOptions
  ): Effect.Effect<
    FetchResponse<SignOutSuccessPayload, SignOutErrorPayload>,
    EmailAuthApiError
  > =>
    Effect.tryPromise({
      try: () =>
        authClient.signOut(options) as Promise<
          FetchResponse<SignOutSuccessPayload, SignOutErrorPayload>
        >,
      catch: (error) =>
        new EmailAuthApiError('Sign out API call failed', undefined, error),
    });
```

#### Step 4: Implement Layer 3 - Response Unwrapping (1 new function)

```typescript
// ============================================================================
// Layer 3: Response Unwrapping
// ============================================================================

/**
 * Type guard for Better Fetch failure responses.
 * REUSED from signInEmail/signUpEmail
 */
export const isFetchFailure = <TData, TError>(
  response: FetchResponse<TData, TError>
): response is FetchFailure<TError> => response.error !== null;

/**
 * Unwraps Better Fetch response union into Effect error channel.
 * REUSED from signInEmail/signUpEmail
 */
export const unwrapFetchResponse =
  <TError>(createError: (error: TError) => EmailAuthError) =>
  <TData>(
    response: FetchResponse<TData, TError>
  ): Effect.Effect<TData, EmailAuthError> =>
    isFetchFailure(response)
      ? Effect.fail(createError(response.error))
      : Effect.succeed(response.data);

/**
 * Creates EmailAuthApiError from sign-out error payload.
 * NEW - specific to signOut
 */
export const createSignOutApiError = (
  error: SignOutErrorPayload
): EmailAuthApiError =>
  new EmailAuthApiError('Sign out failed', error.status, error);
```

#### Step 5: Layer 4 - NO Payload Extraction

```typescript
// ============================================================================
// Layer 4: Payload Extraction
// ============================================================================

// NOT NEEDED - signOut returns void
// unwrapFetchResponse already validates API success
```

#### Step 6: Implement Layer 5 - Callback Execution (2 new functions)

```typescript
// ============================================================================
// Layer 5: Callback Execution
// ============================================================================

/**
 * Executes onSuccess callback if provided.
 * NEW - specific to signOut
 */
export const executeOnSuccessCallback = (
  logger: EmailAuthClientDeps['logger'],
  options?: SignOutOptions
): Effect.Effect<void, never> =>
  Effect.sync(() => {
    const callback = options?.fetchOptions?.onSuccess;
    if (!callback) return;

    try {
      const result = callback();
      if (result instanceof Promise) {
        void result.catch((error) => {
          logger?.warn('signOut onSuccess callback failed', { error });
        });
      }
    } catch (error) {
      logger?.warn('signOut onSuccess callback failed', { error });
    }
  });

/**
 * Executes onError callback if provided.
 * NEW - specific to signOut
 */
export const executeOnErrorCallback = (
  logger: EmailAuthClientDeps['logger'],
  options: SignOutOptions | undefined,
  error: EmailAuthError
): Effect.Effect<void, never> =>
  Effect.sync(() => {
    const callback = options?.fetchOptions?.onError;
    if (!callback) return;

    try {
      const result = callback(error);
      if (result instanceof Promise) {
        void result.catch((cbError) => {
          logger?.warn('signOut onError callback failed', { error: cbError });
        });
      }
    } catch (cbError) {
      logger?.warn('signOut onError callback failed', { error: cbError });
    }
  });
```

#### Step 7: Implement Layer 6 - Logging (3 new functions)

```typescript
// ============================================================================
// Layer 6: Logging & Telemetry
// ============================================================================

/**
 * Logs validation failure.
 * NEW - adapted for signOut
 */
export const logValidationFailure = (
  logger: EmailAuthClientDeps['logger'],
  error: EmailAuthDependenciesError | EmailAuthInputError
): void => {
  logger?.error('signOut validation failed', { error });
};

/**
 * Logs and tracks API failure.
 * NEW - adapted for signOut
 */
export const logApiFailure = (
  logger: EmailAuthClientDeps['logger'],
  telemetry: EmailAuthClientDeps['telemetry'],
  featureFlags: EmailAuthClientDeps['featureFlags'],
  error: EmailAuthApiError
): void => {
  logger?.error('signOut failed', { error });
  void telemetry?.trackEvent('signOut.failed', {
    errorStatus: error.status,
    errorMessage: error.message,
    featureFlags,
  });
};

/**
 * Logs and tracks successful sign-out.
 * NEW - adapted for signOut
 */
export const logSignOutSuccess = (
  logger: EmailAuthClientDeps['logger'],
  telemetry: EmailAuthClientDeps['telemetry'],
  featureFlags: EmailAuthClientDeps['featureFlags'],
  signedOutAll: boolean
): void => {
  logger?.info('signOut succeeded', { all: signedOutAll });
  void telemetry?.trackEvent('signOut.success', {
    all: signedOutAll,
    featureFlags,
  });
};
```

#### Step 8: Layer 7 - NO Result Builder

```typescript
// ============================================================================
// Layer 7: Result Builder
// ============================================================================

// NOT NEEDED - signOut returns void
```

#### Step 9: Implement Layer 8 - Pipeline (1 new function)

```typescript
// ============================================================================
// Layer 8: Composed Pipeline
// ============================================================================

/**
 * Signs out the current user session.
 *
 * @description Validates dependencies and options, calls Better Auth sign-out API,
 * executes callbacks, and returns void. Composed from 11 pure, testable functions
 * following Single Responsibility Principle.
 *
 * @fp-pattern Curried dependency injection with Effect-based error handling
 * @composition pipe with Effect.flatMap orchestration across 6 functional layers:
 *   1. Validation: validateDeps, validateSignOutOptions
 *   2. API call: callSignOutApi
 *   3. Response unwrapping: unwrapFetchResponse, createSignOutApiError
 *   4. Callback execution: executeOnSuccessCallback
 *   5. Logging: logValidationFailure, logApiFailure, logSignOutSuccess
 *   6. Pipeline orchestration: Effect.gen with flatMap composition
 *
 * @param deps - Email auth client dependencies (auth client, logger, telemetry)
 * @returns {Effect.Effect<void, EmailAuthError>} Effect that resolves with void
 * or fails with typed error.
 *
 * @example
 * ```typescript
 * // Sign out current session
 * const program = signOut(deps)();
 * await Effect.runPromise(program);
 *
 * // Sign out all sessions
 * const programAll = signOut(deps)({ all: true });
 * await Effect.runPromise(programAll);
 *
 * // Sign out with callbacks
 * const programWithCallbacks = signOut(deps)({
 *   fetchOptions: {
 *     onSuccess: () => console.log('Signed out!'),
 *     onError: (error) => console.error('Failed:', error),
 *   },
 * });
 * await Effect.runPromise(programWithCallbacks);
 * ```
 */
export const signOut: signOutProps<AuthClient> = (deps) => (options) =>
  Effect.gen(function* () {
    // Layer 1: Validate dependencies
    const validatedDeps = yield* pipe(
      validateDeps<AuthClient>(deps),
      Effect.tapError((error) =>
        Effect.sync(() => logValidationFailure(deps.logger, error))
      )
    );

    // Layer 1: Validate options
    const validatedOptions = yield* pipe(
      validateSignOutOptions(options),
      Effect.tapError((error) =>
        Effect.sync(() => logValidationFailure(validatedDeps.logger, error))
      )
    );

    const { authClient, logger, telemetry, featureFlags } = validatedDeps;

    // Layer 2: Call sign-out API
    const signOutResponse = yield* callSignOutApi(authClient)(validatedOptions);

    // Layer 3: Unwrap Better Fetch response
    yield* pipe(
      unwrapFetchResponse(createSignOutApiError)(signOutResponse),
      Effect.tapError((error) => {
        // Execute onError callback before logging
        void executeOnErrorCallback(logger, validatedOptions, error);
        return Effect.sync(() =>
          logApiFailure(logger, telemetry, featureFlags, error as EmailAuthApiError)
        );
      })
    );

    // Layer 5: Execute onSuccess callback (safe, never fails)
    yield* executeOnSuccessCallback(logger, validatedOptions);

    // Layer 6: Log success
    logSignOutSuccess(
      logger,
      telemetry,
      featureFlags,
      validatedOptions?.all ?? false
    );

    // Return void
    return;
  });
```

---

## 10. Simplified Architecture vs signIn/signUp

### Complexity Comparison

```
signUpEmail: 20+ functions across 8 layers
  ✓ Complex session resolution with fallback
  ✓ User extraction
  ✓ Session extraction + validation
  ✓ Result builder

signInEmail: 15 functions across 7 layers
  ✓ User extraction
  ✓ Session validation (always present)
  ✓ Verification flag extraction
  ✓ Result builder

signOut: 11 functions across 6 layers (NO Layer 4, NO Layer 7)
  ✓ Simple response validation
  ✓ Callback execution (unique to signOut)
  ✗ No user extraction
  ✗ No session extraction
  ✗ No session resolution
  ✗ No result builder
  → Returns void
```

### Why signOut is Simpler

1. **No Data Extraction**: API returns `{ success: boolean }`, we don't use it
2. **No Session Logic**: No session to fetch, extract, validate, or resolve
3. **No Result Building**: Returns `void`, not a complex result object
4. **Optional Input**: `options` can be `undefined`, less validation needed
5. **Void Return**: No type complexity in return value

### Unique Aspects of signOut

1. **Callback Handling**: Only auth operation with `onSuccess`/`onError` callbacks
2. **Safe Execution**: Callbacks wrapped in try-catch, never fail the Effect
3. **Fire-and-Forget**: Async callbacks logged on error but don't block
4. **Optional Everything**: `options` optional, `all` optional, `redirectTo` optional, `fetchOptions` optional

---

## 11. Summary

### Exact Better Auth signOut API Signature

```typescript
authClient.signOut(options?: {
  all?: boolean;
  redirectTo?: string;
  fetchOptions?: {
    onSuccess?: () => void | Promise<void>;
    onError?: (error: unknown) => void | Promise<void>;
  };
}): Promise<{
  data: { success: boolean } | null;
  error: BetterFetchError | null;
}>
```

### Required Types

✅ All exist in `email.types.ts`:

- `SignOutOptions`
- `signOutProps<TAuthClient>`
- `isSignOutOptions` type guard

### Required Errors

✅ All exist in `email.error.ts`:

- `EmailAuthDependenciesError` (deps validation)
- `EmailAuthInputError` (options validation)
- `EmailAuthApiError` (API failures)

❌ Not needed:

- `EmailAuthDataMissingError` (no data extraction)
- `EmailAuthSessionError` (no session logic)

### Reusable Functions (5)

1. `validateDeps` (Layer 1)
2. `isFetchFailure` (Layer 3)
3. `unwrapFetchResponse` (Layer 3)
4. Logging pattern (Layer 6)
5. Effect.gen pipeline pattern (Layer 8)

### New Functions Required (6)

1. `validateSignOutOptions` (Layer 1)
2. `callSignOutApi` (Layer 2)
3. `createSignOutApiError` (Layer 3)
4. `executeOnSuccessCallback` (Layer 5)
5. `executeOnErrorCallback` (Layer 5)
6. `logSignOutSuccess` (Layer 6)

Plus 2 adapted:
7. `logValidationFailure` (Layer 6 - adapted)
8. `logApiFailure` (Layer 6 - adapted)

### Complete Function Signatures

See Section 6 for all function signatures with full JSDoc.

### Callback Execution Strategy

Execute callbacks WITHIN Effect pipeline using `Effect.sync` with try-catch:

- `onSuccess` after API success, before logging
- `onError` during error tapError, before logging
- Both wrapped safely, never fail the Effect
- Async callbacks handled with void promise catch

### Implementation Plan

1. Create `sign-out/signOut.ts`
2. Copy type definitions (Step 1)
3. Implement 11 functions across 6 layers (Steps 2-9)
4. Export from `email.ts`
5. Test with unit tests (each function isolated)
6. Test with integration tests (full pipeline)

### Simplified Architecture

- **6 layers** (vs 7-8 for signIn/signUp)
- **11 functions** (vs 15-20 for signIn/signUp)
- **No Layer 4** (payload extraction)
- **No Layer 7** (result builder)
- **Returns void** (simplest possible return)
- **Unique callback handling** (safe execution)

---

## Appendix: Quick Reference

### Type Summary

```typescript
// Input
type SignOutOptions = {
  all?: boolean;
  redirectTo?: string;
  fetchOptions?: {
    onSuccess?: () => void | Promise<void>;
    onError?: (error: unknown) => void | Promise<void>;
  };
};

// Output
type SignOutResult = void;

// Internal
type SignOutSuccessPayload = { success: boolean };
type SignOutErrorPayload = BetterFetchError & Record<string, unknown>;
```

### Error Summary

```typescript
// Used
type SignOutErrors =
  | EmailAuthDependenciesError  // deps validation
  | EmailAuthInputError          // options validation
  | EmailAuthApiError;           // API call failure

// Not Used
type UnusedErrors =
  | EmailAuthDataMissingError    // no data extraction
  | EmailAuthSessionError;       // no session logic
```

### Layer Summary

```
Layer 1: Validation (validateDeps, validateSignOutOptions)
Layer 2: API Call (callSignOutApi)
Layer 3: Response Unwrapping (isFetchFailure, unwrapFetchResponse, createSignOutApiError)
Layer 4: SKIPPED (no payload extraction)
Layer 5: Callback Execution (executeOnSuccessCallback, executeOnErrorCallback)
Layer 6: Logging (logValidationFailure, logApiFailure, logSignOutSuccess)
Layer 7: SKIPPED (no result builder)
Layer 8: Pipeline (Effect.gen composition)
```

---

**End of Analysis**
