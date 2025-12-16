import * as Config from "effect/Config";
import type { ServerConfig } from "../../shared/config/config.types";

/**
 * Effect Config for server configuration.
 *
 * @description Provides type-safe access to environment variables for server configuration.
 */
export const serverConfig = Config.all({
  appName: Config.string("APP_NAME").pipe(Config.withDefault("My Application")),
  baseURL: Config.string("BETTER_AUTH_URL").pipe(Config.withDefault("http://localhost:3000")),
  secret: Config.string("BETTER_AUTH_SECRET"),
});

/**
 * Helper function to create server configuration with defaults.
 *
 * @param config - Server configuration
 * @returns Server configuration with defaults
 */
export function createServerConfig(config: ServerConfig): ServerConfig {
  return config;
}
