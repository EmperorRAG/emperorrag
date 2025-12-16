import type * as Effect from "effect/Effect";
import type { AuthServerApiError, AuthServerInputError } from "../../../../errors/authServer.error";
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from "../../../server.types";

/**
 * Type helper to extract the signInSocial endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `signInSocial` method from the server API. This method
 * initiates OAuth authentication with a social provider, returning a redirect URL or session data.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerApiSignInSocialPropsFor<T extends AuthServerFor = AuthServerFor> = "signInSocial" extends
  AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>["signInSocial"] : never;

/**
 * Type alias for the parameters of the signInSocial API.
 *
 * @description Represents the input parameters required for the signInSocial operation.
 * It extracts the parameter type from the `signInSocial` method of the AuthServer API.
 * This ensures type safety and alignment with the underlying Better Auth library.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerApiSignInSocialParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<
  AuthServerApiSignInSocialPropsFor<AuthServerFor>
>[0];

/**
 * Type helper to extract the return type from auth.api.signInSocial.
 *
 * @pure
 * @description Extracts the Promise return type from the server API method.
 * The Promise resolves to redirect URL or session information depending on configuration.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerApiSignInSocialResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<
  AuthServerApiSignInSocialPropsFor<AuthServerFor>
>;

/**
 * Type guard for AuthServerApiSignInSocialParamsFor.
 *
 * @pure
 * @description Checks if the provided unknown value conforms to the AuthServerApiSignInSocialParamsFor structure.
 * This is useful for runtime validation of input parameters.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 * @param u - The unknown value to check
 * @returns True if u is a valid AuthServerApiSignInSocialParamsFor, false otherwise
 */
export function isAuthServerApiSignInSocialParamsFor<T extends AuthServerFor = AuthServerFor>(
  u: unknown,
): u is AuthServerApiSignInSocialParamsFor<AuthServerFor> {
  return typeof u === "object" && u !== null && "body" in u;
}

/**
 * Type alias for the signInSocial function signature.
 *
 * @description Defines the contract for the signInSocial service and controller functions.
 * It specifies that the function takes `AuthServerApiSignInSocialParamsFor` as input
 * and returns an Effect that requires `AuthServerFor` context.
 * The Effect can fail with `AuthServerApiError` or succeed with the result of `signInSocial`.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type signInSocialPropsFor = (
  params: AuthServerApiSignInSocialParamsFor<AuthServerFor>,
) => Effect.Effect<
  Awaited<AuthServerApiSignInSocialResultFor<AuthServerFor>>,
  AuthServerApiError | AuthServerInputError,
  AuthServerFor
>;
