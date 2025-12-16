/**
 * Atomic Actions for Policy Extraction:
 *
 * 1. Extract Auth Options
 *    - Input: `AuthServer` instance
 *    - Action: Access the `options` property from the `AuthServer` instance.
 *    - Output: `BetterAuthOptions` object (or undefined).
 *
 * 2. Extract Email & Password Configuration
 *    - Input: `BetterAuthOptions`
 *    - Action: Access the `emailAndPassword` property.
 *    - Output: Email and password configuration object (or undefined).
 *
 * 3. Extract Minimum Password Length
 *    - Input: Email and password configuration
 *    - Action: Access `minPasswordLength`.
 *    - Logic: If undefined, default to 8.
 *    - Output: `number`.
 *
 * 4. Extract Maximum Password Length
 *    - Input: Email and password configuration
 *    - Action: Access `maxPasswordLength`.
 *    - Logic: If undefined, default to 32.
 *    - Output: `number`.
 *
 * 5. Construct Password Policy
 *    - Input: Min and Max lengths
 *    - Action: Create a `PasswordPolicy` object.
 *    - Output: `{ minLength: number; maxLength: number }`.
 *
 * 6. Construct Global Policy
 *    - Input: `PasswordPolicy` (and future sub-policies)
 *    - Action: Aggregate into a single `Policy` object.
 *    - Output: `Policy` object.
 */

import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";
import * as Option from "effect/Option";
import type { AuthServer } from "../../server/server.types";

export type PasswordPolicy = {
  readonly minLength: number;
  readonly maxLength: number;
};

export type Policy = {
  readonly password: PasswordPolicy;
  readonly secret: Option.Option<string>;
  readonly baseURL: Option.Option<string>;
  readonly basePath: string;
  readonly database: Option.Option<NonNullable<AuthOptions>["database"]>;
  readonly session: Option.Option<NonNullable<AuthOptions>["session"]>;
  readonly cookies: Option.Option<NonNullable<AuthOptions>["advanced"]>;
  readonly trustedOrigins: Option.Option<
    NonNullable<AuthOptions>["trustedOrigins"]
  >;
  readonly socialProviders: Option.Option<
    NonNullable<AuthOptions>["socialProviders"]
  >;
  readonly user: Option.Option<NonNullable<AuthOptions>["user"]>;
  readonly plugins: Option.Option<NonNullable<AuthOptions>["plugins"]>;
  readonly logger: Option.Option<NonNullable<AuthOptions>["logger"]>;
};

type AuthOptions = AuthServer["options"];
type EmailAndPasswordConfig = NonNullable<AuthOptions>["emailAndPassword"];

/**
 * Helper to extract a property from an Option wrapped object.
 *
 * @param input - The object wrapped in Option.
 * @param selector - A function to select the property from the object.
 * @returns {Effect.Effect<Option.Option<TOutput>>} The selected property wrapped in Option and Effect.
 */
const extractProperty = <TInput, TOutput>(
  input: Option.Option<TInput>,
  selector: (input: TInput) => TOutput | undefined | null,
): Effect.Effect<Option.Option<TOutput>> =>
  Effect.sync(() =>
    pipe(
      input,
      Option.flatMap((i) => Option.fromNullable(selector(i))),
    )
  );

/**
 * Extracts the options from the AuthServer instance.
 *
 * @param server - The AuthServer instance.
 * @returns {Effect.Effect<Option.Option<AuthOptions>>} The options wrapped in Option.
 */
export const extractAuthOptions = (
  server: AuthServer,
): Effect.Effect<Option.Option<AuthOptions>> => Effect.sync(() => Option.fromNullable(server.options));

/**
 * Extracts the minimum password length from the configuration.
 *
 * @param config - The EmailAndPasswordConfig wrapped in Option.
 * @returns {Effect.Effect<number>} The minimum password length (defaults to 8).
 */
export const extractMinPasswordLength = (
  config: Option.Option<EmailAndPasswordConfig>,
): Effect.Effect<number> =>
  pipe(
    extractProperty(config, (c) => c?.minPasswordLength),
    Effect.map(Option.getOrElse(() => 8)),
  );

/**
 * Extracts the maximum password length from the configuration.
 *
 * @param config - The EmailAndPasswordConfig wrapped in Option.
 * @returns {Effect.Effect<number>} The maximum password length (defaults to 32).
 */
export const extractMaxPasswordLength = (
  config: Option.Option<EmailAndPasswordConfig>,
): Effect.Effect<number> =>
  pipe(
    extractProperty(config, (c) => c?.maxPasswordLength),
    Effect.map(Option.getOrElse(() => 32)),
  );

/**
 * Constructs the password policy from min and max lengths.
 *
 * @param inputs - The min and max lengths.
 * @returns {Effect.Effect<PasswordPolicy>} The password policy.
 */
export const constructPasswordPolicy = (inputs: {
  minLength: number;
  maxLength: number;
}): Effect.Effect<PasswordPolicy> =>
  Effect.succeed({
    minLength: inputs.minLength,
    maxLength: inputs.maxLength,
  });

/**
 * Extracts the policy from the options.
 *
 * @param options - The AuthOptions wrapped in Option.
 * @returns {Effect.Effect<Policy>} The policy.
 */
export const decodePolicy = (
  options: Option.Option<AuthOptions>,
): Effect.Effect<Policy> =>
  pipe(
    Effect.all({
      emailAndPassword: extractProperty(
        options,
        (opts) => opts?.emailAndPassword,
      ),
      secret: extractProperty(options, (opts) => opts?.secret),
      baseURL: extractProperty(options, (opts) => opts?.baseURL),
      basePath: pipe(
        extractProperty(options, (opts) => opts?.basePath),
        Effect.map(Option.getOrElse(() => "/api/auth")),
      ),
      database: extractProperty(options, (opts) => opts?.database),
      session: extractProperty(options, (opts) => opts?.session),
      cookies: extractProperty(options, (opts) => opts?.advanced?.cookies ? opts.advanced : undefined),
      trustedOrigins: extractProperty(options, (opts) => opts?.trustedOrigins),
      socialProviders: extractProperty(
        options,
        (opts) => opts?.socialProviders,
      ),
      user: extractProperty(options, (opts) => opts?.user),
      plugins: extractProperty(options, (opts) => opts?.plugins),
      logger: extractProperty(options, (opts) => opts?.logger),
    }),
    Effect.flatMap(({ emailAndPassword, ...rest }) =>
      pipe(
        Effect.all({
          minLength: extractMinPasswordLength(emailAndPassword),
          maxLength: extractMaxPasswordLength(emailAndPassword),
        }),
        Effect.flatMap(constructPasswordPolicy),
        Effect.map((password) => ({
          password,
          ...rest,
        })),
      )
    ),
  );
