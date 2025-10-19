import type { betterAuth } from 'better-auth';
import type { apiKey, twoFactor, admin, organization } from 'better-auth/plugins';

/**
 * Type helper for better-auth instances with API key plugin
 */
export type BetterAuthWithApiKey = ReturnType<typeof betterAuth<{
  plugins: [ReturnType<typeof apiKey>];
}>>;

/**
 * Type helper for better-auth instances with two-factor plugin
 */
export type BetterAuthWithTwoFactor = ReturnType<typeof betterAuth<{
  plugins: [ReturnType<typeof twoFactor>];
}>>;

/**
 * Type helper for better-auth instances with admin plugin
 */
export type BetterAuthWithAdmin = ReturnType<typeof betterAuth<{
  plugins: [ReturnType<typeof admin>];
}>>;

/**
 * Type helper for better-auth instances with organization plugin
 */
export type BetterAuthWithOrganization = ReturnType<typeof betterAuth<{
  plugins: [ReturnType<typeof organization>];
}>>;

/**
 * Type helper for better-auth instances with multiple plugins
 */
export type BetterAuthWithPlugins<T extends any[]> = ReturnType<typeof betterAuth<{
  plugins: T;
}>>;