/**
 * @packageDocumentation
 * @module users.utils
 * @category Auth Utilities
 *
 * Provides the canonical Better Auth user interaction primitives that every
 * downstream project in this workspace consumes. Both server-side and
 * client-side use cases compose these helpers by supplying their own Better
 * Auth instances (for example the NestJS microservice server instance or the
 * React client instance) together with the inferred `$Infer.Session` and
 * `$Infer.Instance` types produced by those instances.
 *
 * @remarks
 * - All logic in this module adheres to the Effect-TS functional programming
 *   paradigm documented in {@link https://github.com/EmperorRAG/emperorrag/blob/master/.github/instructions/fp-paradigm.instructions.md}.
 * - Consumers MUST treat the inline TypeDoc as the single source of truth when
 *   integrating these helpers; generated documentation and markdown guides are
 *   derived from these comments.
 * - Functions are written in a data-last style, return immutable values, and
 *   use {@link Effect} pipelines to describe side effects.
 * - Future client-facing helpers will reuse the same generic shapes exported
 *   here so that any Better Auth plugin stack can be accommodated by simply
 *   currying the relevant auth instance.
 *
 * @see {@link https://github.com/EmperorRAG/emperorrag/blob/master/AGENTS.md}
 * @see {@link https://github.com/EmperorRAG/emperorrag/blob/master/apps/better-auth-nest-js-microservice/src/lib/auth/auth.ts}
 * @since 0.0.1
 */

import { Context, Effect, pipe } from 'effect';

// ============================================================================
// Custom Error Classes
// ============================================================================

/**
 * Error thrown when a user is not found in the database.
 *
 * @category Errors
 * @remarks
 * - Raised by utilities such as {@link findUserById} when the underlying
 *   Prisma adapter returns no record for the supplied identifier.
 * - Downstream code SHOULD rely on the `_tag` discriminator to perform
 *   pattern matching within Effect pipelines.
 *
 * @example
 * ```ts
 * import { Effect } from 'effect';
 * import { findUserById, UserNotFoundError } from '@emperorrag/better-auth-utilities';
 *
 * const program = findUserById('unknown-id');
 *
 * Effect.runPromise(program).catch((error) => {
 *   if (error instanceof UserNotFoundError) {
 *     console.error('User missing');
 *   }
 * });
 * ```
 */
export class UserNotFoundError extends Error {
  readonly _tag = 'UserNotFoundError';

  constructor(
    message: string,
    public readonly userId?: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'UserNotFoundError';
  }
}

/**
 * Error thrown when attempting to create a user that already exists.
 *
 * @category Errors
 * @remarks
 * - Emitted by {@link checkEmailUniqueness} and {@link createUser} when Prisma
 *   signals a uniqueness violation.
 * - The optional {@link email} property contains the conflicting address for
 *   downstream auditing or tracing.
 */
export class UserExistsError extends Error {
  readonly _tag = 'UserExistsError';

  constructor(
    message: string,
    public readonly email?: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'UserExistsError';
  }
}

/**
 * Error thrown when a database operation fails.
 *
 * @category Errors
 * @remarks
 * Wraps lower-level Prisma or driver exceptions so Effect pipelines can expose
 * a stable error surface without leaking implementation-specific error types.
 */
export class DatabaseError extends Error {
  readonly _tag = 'DatabaseError';

  constructor(
    message: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Minimal Prisma Client interface for user operations.
 *
 * @category Types
 * @remarks
 * Consumers may provide any Prisma client implementation that satisfies this
 * structural contract. Additional fields are intentionally omitted to keep the
 * dependency boundary narrow and test-friendly.
 */
export interface PrismaClient {
  readonly user: {
    readonly findUnique: (args: { where: { id: string } }) => Promise<User | null>;
    readonly findFirst: (args: { where: { email: string } }) => Promise<User | null>;
    readonly create: (args: { data: CreateUserData }) => Promise<User>;
  };
}

/**
 * User model representing a user in the database.
 *
 * @category Types
 * @remarks
 * Mirrors the Better Auth canonical user representation. Downstream projects
 * can extend this type via intersection with auth instance specific metadata
 * inferred from `$Infer.User` when required.
 */
export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly emailVerified: boolean;
  readonly image?: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly bannedUntil?: Date | null;
  readonly banned?: boolean | null;
  readonly banReason?: string | null;
  readonly banExpires?: Date | null;
}

/**
 * Data required to create a new user.
 *
 * @category Types
 * @remarks
 * Represents the minimal data payload accepted by {@link createUser}. Extra
 * fields should be handled by higher-level factories that know about the
 * plugin configuration for a given Better Auth instance.
 */
export interface CreateUserData {
  readonly email: string;
  readonly name: string;
  readonly emailVerified?: boolean;
  readonly image?: string | null;
}

/**
 * Tag for the PrismaClient using the Effect Context.Tag pattern.
 *
 * @category Context
 * @remarks
 * - Allows dependency injection of a {@link PrismaClient} instance into Effect
 *   pipelines without relying on global state.
 * - Server-side utilities should provide the Prisma client scoped to the
 *   request handling lifetime. Client-side utilities SHOULD NOT attempt to
 *   resolve this tag.
 */
export class PrismaClientTag extends Context.Tag('PrismaClient')<
  PrismaClientTag,
  PrismaClient
>() {}

// ============================================================================
// Supporting Utilities
// ============================================================================

/**
 * Validates a user ID.
 *
 * @pure
 * @category Validation
 * @description Ensures the user ID is a non-empty string.
 *
 * @fp-pattern Pure function returning Effect for validation
 * @composition {@link pipe} -> {@link Effect.try}
 *
 * @param userId - The user ID to validate.
 * @returns {Effect.Effect<string, UserNotFoundError>} Effect containing the validated ID or a {@link UserNotFoundError} failure.
 *
 * @example
 * ```ts
 * import { Effect } from 'effect';
 * import { validateUserId } from '@emperorrag/better-auth-utilities';
 *
 * const program = validateUserId('user-123');
 * Effect.runSync(program); // => 'user-123'
 * ```
 */
export const validateUserId = (
  userId: string
): Effect.Effect<string, UserNotFoundError> =>
  Effect.try({
    try: () => {
      if (!userId || userId.trim().length === 0) {
        throw new UserNotFoundError('User ID is required and cannot be empty');
      }
      return userId;
    },
    catch: (error) =>
      error instanceof UserNotFoundError
        ? error
        : new UserNotFoundError('Failed to validate user ID', undefined, error),
  });

/**
 * Validates user creation data.
 *
 * @pure
 * @category Validation
 * @description Ensures required fields (email, name) are present and valid.
 *
 * @fp-pattern Pure function returning Effect for validation
 * @composition {@link pipe} -> {@link Effect.try}
 *
 * @param userData - The user data to validate.
 * @returns {Effect.Effect<CreateUserData, UserExistsError>} Effect containing the validated payload or a {@link UserExistsError}.
 *
 * @example
 * ```ts
 * import { Effect } from 'effect';
 * import { validateUserData } from '@emperorrag/better-auth-utilities';
 *
 * const data = { email: 'user@example.com', name: 'John Doe' };
 * const program = validateUserData(data);
 * Effect.runSync(program); // => { email: 'user@example.com', name: 'John Doe' }
 * ```
 */
export const validateUserData = (
  userData: CreateUserData
): Effect.Effect<CreateUserData, UserExistsError> =>
  Effect.try({
    try: () => {
      if (!userData.email || userData.email.trim().length === 0) {
        throw new UserExistsError('Email is required and cannot be empty');
      }
      if (!userData.name || userData.name.trim().length === 0) {
        throw new UserExistsError('Name is required and cannot be empty');
      }
      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new UserExistsError('Invalid email format', userData.email);
      }
      return userData;
    },
    catch: (error) =>
      error instanceof UserExistsError
        ? error
        : new UserExistsError('Failed to validate user data', undefined, error),
  });

/**
 * Checks if a user with the given email already exists.
 *
 * @category Validation
 * @description Queries the database to check for email uniqueness.
 *
 * @fp-pattern Effectful function with database dependency
 * @composition {@link Effect.gen} + {@link PrismaClientTag}
 *
 * @param email - The email to check.
 * @returns {Effect.Effect<void, UserExistsError | DatabaseError, PrismaClientTag>} Effect that succeeds if email is unique or fails if.email exists or a database error occurs.
 *
 * @example
 * ```ts
 * import { Effect } from 'effect';
 * import { PrismaClient } from '@prisma/client';
 * import { PrismaClientTag, checkEmailUniqueness } from '@emperorrag/better-auth-utilities';
 *
 * const prisma = new PrismaClient();
 * const program = Effect.provideService(checkEmailUniqueness('user@example.com'), PrismaClientTag, prisma);
 * await Effect.runPromise(program);
 * ```
 */
export const checkEmailUniqueness = (
  email: string
): Effect.Effect<void, UserExistsError | DatabaseError, PrismaClientTag> =>
  Effect.gen(function* () {
    const prisma = yield* PrismaClientTag;

    // Query database for existing user
    const existingUser = yield* Effect.tryPromise({
      try: () => prisma.user.findFirst({ where: { email } }),
      catch: (error) =>
        new DatabaseError('Failed to check email uniqueness in database', error),
    });

    // If user exists, throw error
    if (existingUser) {
      return yield* Effect.fail(
        new UserExistsError(`User with email ${email} already exists`, email)
      );
    }

    return;
  });

// ============================================================================
// Main Utilities
// ============================================================================

/**
 * Finds a user by their ID.
 *
 * @category Queries
 * @description Queries Prisma for a user record using the provided identifier.
 *
 * @fp-pattern Effectful function with database dependency
 * @composition {@link pipe} -> {@link validateUserId} -> {@link Effect.gen}
 *
 * @param userId - The ID of the user to find.
 * @returns {Effect.Effect<User, UserNotFoundError | DatabaseError, PrismaClientTag>} Effect resolving with the {@link User} or failing with {@link UserNotFoundError} / {@link DatabaseError}.
 *
 * @example
 * ```ts
 * import { Effect } from 'effect';
 * import { PrismaClient } from '@prisma/client';
 * import { PrismaClientTag, findUserById } from '@emperorrag/better-auth-utilities';
 *
 * const prisma = new PrismaClient();
 * const program = Effect.provideService(findUserById('user-123'), PrismaClientTag, prisma);
 * const user = await Effect.runPromise(program);
 * console.log(user.email);
 * ```
 */
export const findUserById = (
  userId: string
): Effect.Effect<User, UserNotFoundError | DatabaseError, PrismaClientTag> =>
  pipe(
    validateUserId(userId),
    Effect.flatMap((validatedId) =>
      Effect.gen(function* () {
        // Get PrismaClient from Context
        const prisma = yield* PrismaClientTag;

        // Query database for user
        const user = yield* Effect.tryPromise({
          try: () => prisma.user.findUnique({ where: { id: validatedId } }),
          catch: (error) =>
            new DatabaseError(
              `Failed to query user with ID ${validatedId} from database`,
              error
            ),
        });

        // Check if user was found
        if (!user) {
          return yield* Effect.fail(
            new UserNotFoundError(
              `User with ID ${validatedId} not found`,
              validatedId
            )
          );
        }

        return user;
      })
    )
  );

/**
 * Creates a new user in the database.
 *
 * @category Mutations
 * @description Persists a new user using the supplied {@link PrismaClient} implementation.
 *
 * @fp-pattern Effectful function with database dependency
 * @composition {@link pipe} -> {@link validateUserData} -> {@link Effect.gen}
 *
 * @param userData - The data for the new user (email, name, optional image and emailVerified).
 * @returns {Effect.Effect<User, UserExistsError | DatabaseError, PrismaClientTag>} Effect resolving with the created {@link User} or failing with {@link UserExistsError} / {@link DatabaseError}.
 *
 * @example
 * ```ts
 * import { Effect } from 'effect';
 * import { PrismaClient } from '@prisma/client';
 * import { PrismaClientTag, createUser } from '@emperorrag/better-auth-utilities';
 *
 * const prisma = new PrismaClient();
 * const payload = { email: 'newuser@example.com', name: 'Jane Doe' };
 * const program = Effect.provideService(createUser(payload), PrismaClientTag, prisma);
 * const user = await Effect.runPromise(program);
 * console.log(user.id);
 * ```
 */
export const createUser = (
  userData: CreateUserData
): Effect.Effect<User, UserExistsError | DatabaseError, PrismaClientTag> =>
  pipe(
    validateUserData(userData),
    Effect.flatMap((validatedData) =>
      Effect.gen(function* () {
        // Check if user with email already exists
        yield* checkEmailUniqueness(validatedData.email);

        // Get PrismaClient from Context
        const prisma = yield* PrismaClientTag;

        // Create the user in the database
        const newUser = yield* Effect.tryPromise({
          try: () => prisma.user.create({ data: validatedData }),
          catch: (error) => {
            // Check if it's a unique constraint violation
            if (
              error &&
              typeof error === 'object' &&
              'code' in error &&
              error.code === 'P2002'
            ) {
              return new UserExistsError(
                `User with email ${validatedData.email} already exists`,
                validatedData.email,
                error
              );
            }
            return new DatabaseError(
              'Failed to create user in database',
              error
            );
          },
        });

        return newUser;
      })
    )
  );
