import * as Effect from "effect/Effect";
import { AuthServerTag } from "../../server/server.service";
import type { AuthServerFor } from "../../server/server.types";
import type {
  AuthServerConfig,
  AuthServerConfigScope,
  ExtractedAuthServerConfig,
} from "./extractAuthServerConfig.types";

/**
 * Extracts configuration from the AuthServer instance based on the provided scope.
 *
 * @pure
 * @description Retrieves the AuthServer from the context and extracts its configuration options.
 * Supports extracting the entire configuration ('all'), a specific property key, or configuration for a specific endpoint.
 * Fails if the configuration options are not available on the server instance.
 *
 * @param scope - The scope of configuration to extract ('all', a specific key, or an endpoint).
 * @returns Effect that resolves to the extracted configuration.
 */
export const extractAuthServerConfig = <K extends AuthServerConfigScope>(
  scope: K,
): Effect.Effect<ExtractedAuthServerConfig<K>, Error, AuthServerFor> =>
  Effect.gen(function*() {
    const authServer = yield* AuthServerTag;

    // Accessing internal options property.
    // We cast to AuthServerConfig | undefined because 'options' is an internal property
    // that might not be strictly typed on the public AuthServer interface in all contexts.
    const options = authServer.options as AuthServerConfig | undefined;

    if (!options) {
      return yield* Effect.fail(
        new Error("AuthServer configuration options are not available"),
      );
    }

    if (scope === "all") {
      return options as unknown as ExtractedAuthServerConfig<K>;
    }

    const getMappedKey = (s: unknown): keyof AuthServerConfig | undefined => {
      if (typeof s !== "object" || s === null || !("_tag" in s)) {
        return undefined;
      }
      const tag = (s as { _tag: string })._tag;
      switch (tag) {
        case "SignInEmail":
        case "SignUpEmail":
        case "ChangePassword":
        case "ResetPassword":
        case "SetPassword":
          return "emailAndPassword";
        default:
          return undefined;
      }
    };

    // Check if the scope is an endpoint that maps to a config key
    const mappedKey = getMappedKey(scope);

    if (mappedKey) {
      const extracted = { [mappedKey]: options[mappedKey] };
      return extracted as unknown as ExtractedAuthServerConfig<K>;
    }

    // Fallback: assume scope is a direct config key
    const configKey = scope as keyof AuthServerConfig;
    // We can check if the key actually exists in options if we want to be stricter,
    // but for now we follow the previous pattern.
    const extracted = { [configKey]: options[configKey] };
    return extracted as unknown as ExtractedAuthServerConfig<K>;
  });
