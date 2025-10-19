import { vi } from 'vitest';
import type { BetterAuthWithApiKey } from './auth-types.js';
import type {
  APIKey,
  CreateAPIKeyOptions,
  UpdateAPIKeyOptions,
  ListAPIKeysOptions,
  VerifyAPIKeyOptions,
  VerifyAPIKeyResult,
} from '../adapters/api-key/api-key.adapter.js';

// ============================================================================
// BETTER-AUTH API KEY TEST DATA GENERATORS
// ============================================================================

/**
 * Creates a complete Better-Auth ApiKey with all properties
 * This matches the actual better-auth API key structure
 */
export const createBetterAuthApiKey = (overrides?: Partial<{
  key: string;
  metadata: any;
  permissions: any;
  id: string;
  name: string | null;
  start: string | null;
  prefix: string | null;
  userId: string;
  refillInterval: number | null;
  refillAmount: number | null;
  lastRefillAt: Date | null;
  enabled: boolean;
  rateLimitEnabled: boolean;
  rateLimitTimeWindow: number | null;
  rateLimitMax: number | null;
  requestCount: number;
  remaining: number | null;
  lastRequest: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}>): Readonly<{
  key: string;
  metadata: any;
  permissions: any;
  id: string;
  name: string | null;
  start: string | null;
  prefix: string | null;
  userId: string;
  refillInterval: number | null;
  refillAmount: number | null;
  lastRefillAt: Date | null;
  enabled: boolean;
  rateLimitEnabled: boolean;
  rateLimitTimeWindow: number | null;
  rateLimitMax: number | null;
  requestCount: number;
  remaining: number | null;
  lastRequest: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}> => Object.freeze({
  key: 'sk_test_123456',
  metadata: { purpose: 'testing' },
  permissions: { read: ['*'], write: ['*'] },
  id: 'key_123',
  name: 'Test API Key',
  start: null,
  prefix: 'sk_test',
  userId: 'user_123',
  refillInterval: 3600,
  refillAmount: 100,
  lastRefillAt: null,
  enabled: true,
  rateLimitEnabled: true,
  rateLimitTimeWindow: 60,
  rateLimitMax: 100,
  requestCount: 0,
  remaining: 100,
  lastRequest: null,
  expiresAt: new Date('2025-12-31'),
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
  ...overrides,
});

/**
 * Creates an APIKey for the adapter interface
 */
export const createAPIKey = (overrides?: Partial<APIKey>): Readonly<APIKey> => Object.freeze({
  id: 'key_123',
  name: 'Test API Key',
  key: 'sk_test_123456',
  userId: 'user_123',
  expiresAt: new Date('2025-12-31'),
  permissions: { read: ['*'], write: ['*'] },
  metadata: { purpose: 'testing' },
  rateLimit: {
    enabled: true,
    timeWindow: 60,
    maxRequests: 100,
  },
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
  ...overrides,
});

/**
 * Creates CreateAPIKeyOptions for testing
 */
export const createCreateAPIKeyOptions = (
  overrides?: Partial<CreateAPIKeyOptions>
): Readonly<CreateAPIKeyOptions> => Object.freeze({
  name: 'Test API Key',
  expiresIn: 86400,
  permissions: { read: ['*'], write: ['*'] },
  metadata: { purpose: 'testing' },
  rateLimit: {
    enabled: true,
    timeWindow: 60,
    maxRequests: 100,
  },
  ...overrides,
});

/**
 * Creates UpdateAPIKeyOptions for testing
 */
export const createUpdateAPIKeyOptions = (
  overrides?: Partial<UpdateAPIKeyOptions>
): Readonly<UpdateAPIKeyOptions> => Object.freeze({
  id: 'key_123',
  name: 'Updated API Key',
  permissions: { read: ['*'] },
  metadata: { updated: true },
  rateLimit: {
    enabled: true,
    timeWindow: 120,
    maxRequests: 200,
  },
  ...overrides,
});

/**
 * Creates ListAPIKeysOptions for testing
 */
export const createListAPIKeysOptions = (
  overrides?: Partial<ListAPIKeysOptions>
): Readonly<ListAPIKeysOptions> => Object.freeze({
  userId: 'user_123',
  limit: 10,
  offset: 0,
  ...overrides,
});

/**
 * Creates VerifyAPIKeyOptions for testing
 */
export const createVerifyAPIKeyOptions = (
  overrides?: Partial<VerifyAPIKeyOptions>
): Readonly<VerifyAPIKeyOptions> => Object.freeze({
  key: 'sk_test_123456',
  ...overrides,
});

/**
 * Creates VerifyAPIKeyResult for testing - valid key
 */
export const createVerifyAPIKeyResultValid = (
  overrides?: Partial<VerifyAPIKeyResult>
): Readonly<VerifyAPIKeyResult> => Object.freeze({
  valid: true,
  apiKey: createAPIKey(),
  ...overrides,
});

/**
 * Creates VerifyAPIKeyResult for testing - invalid key
 */
export const createVerifyAPIKeyResultInvalid = (
  overrides?: Partial<VerifyAPIKeyResult>
): Readonly<VerifyAPIKeyResult> => Object.freeze({
  valid: false,
  apiKey: undefined,
  error: 'Invalid API key',
  ...overrides,
});

// ============================================================================
// BETTER-AUTH API RESPONSE TRANSFORMERS
// ============================================================================

/**
 * Transforms a Better-Auth API key (full structure) to the adapter's APIKey interface (subset)
 */
export const transformBetterAuthApiKeyToAPIKey = (betterAuthKey: {
  key: string;
  metadata: any;
  permissions: any;
  id: string;
  name: string | null;
  start: string | null;
  prefix: string | null;
  userId: string;
  refillInterval: number | null;
  refillAmount: number | null;
  lastRefillAt: Date | null;
  enabled: boolean;
  rateLimitEnabled: boolean;
  rateLimitTimeWindow: number | null;
  rateLimitMax: number | null;
  requestCount: number;
  remaining: number | null;
  lastRequest: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): APIKey => ({
  id: betterAuthKey.id,
  name: betterAuthKey.name ?? '',
  key: betterAuthKey.key,
  userId: betterAuthKey.userId,
  expiresAt: betterAuthKey.expiresAt ?? undefined,
  permissions: betterAuthKey.permissions ?? undefined,
  metadata: betterAuthKey.metadata ?? undefined,
  rateLimit: betterAuthKey.rateLimitEnabled
    ? {
        enabled: betterAuthKey.rateLimitEnabled,
        timeWindow: betterAuthKey.rateLimitTimeWindow ?? 60,
        maxRequests: betterAuthKey.rateLimitMax ?? 100,
      }
    : undefined,
  createdAt: betterAuthKey.createdAt,
  updatedAt: betterAuthKey.updatedAt,
});

/**
 * Transforms an array of Better-Auth API keys to adapter APIKey interfaces
 */
export const transformBetterAuthApiKeysToAPIKeys = (
  betterAuthKeys: Array<{
    key: string;
    metadata: any;
    permissions: any;
    id: string;
    name: string | null;
    start: string | null;
    prefix: string | null;
    userId: string;
    refillInterval: number | null;
    refillAmount: number | null;
    lastRefillAt: Date | null;
    enabled: boolean;
    rateLimitEnabled: boolean;
    rateLimitTimeWindow: number | null;
    rateLimitMax: number | null;
    requestCount: number;
    remaining: number | null;
    lastRequest: Date | null;
    expiresAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }>
): APIKey[] => betterAuthKeys.map(transformBetterAuthApiKeyToAPIKey);

/**
 * Transforms a Better-Auth createApiKey response to AdapterResponse<APIKey>
 * Returns a function that accepts CreateAPIKeyOptions and returns the transformed response
 * Handles both wrapped ({ data, error }) and unwrapped (direct data) response formats
 */
export const transformCreateApiKeyResponse = (
  betterAuthFn: (options: CreateAPIKeyOptions & { headers?: Headers | Record<string, string> }) => Promise<any>
) => async (options: CreateAPIKeyOptions & { headers?: Headers | Record<string, string> }): Promise<{ data?: APIKey; error?: unknown }> => {
  const betterAuthResponse = await betterAuthFn(options);

  // Check if response is wrapped ({ data, error }) or unwrapped (direct data)
  const isWrapped = betterAuthResponse && ('data' in betterAuthResponse || 'error' in betterAuthResponse);

  if (isWrapped) {
    // Wrapped format: { data?, error? }
    return {
      data: betterAuthResponse.data
        ? transformBetterAuthApiKeyToAPIKey(betterAuthResponse.data)
        : undefined,
      error: betterAuthResponse.error,
    };
  } else {
    // Unwrapped format: direct data
    return {
      data: betterAuthResponse
        ? transformBetterAuthApiKeyToAPIKey(betterAuthResponse)
        : undefined,
      error: undefined,
    };
  }
};

/**
 * Transforms a Better-Auth listApiKeys response to AdapterResponse<APIKey[]>
 * Returns a function that accepts ListAPIKeysOptions and returns the transformed response
 * Handles both wrapped ({ data, error }) and unwrapped (direct data) response formats
 */
export const transformListApiKeysResponse = (
  betterAuthFn: (options: ListAPIKeysOptions & { headers?: Headers | Record<string, string> }) => Promise<any>
) => async (options: ListAPIKeysOptions & { headers?: Headers | Record<string, string> }): Promise<{ data?: APIKey[]; error?: unknown }> => {
  const betterAuthResponse = await betterAuthFn(options);

  // Check if response is wrapped ({ data, error }) or unwrapped (direct data)
  const isWrapped = betterAuthResponse && ('data' in betterAuthResponse || 'error' in betterAuthResponse);

  if (isWrapped) {
    // Wrapped format: { data?, error? }
    return {
      data: betterAuthResponse.data
        ? transformBetterAuthApiKeysToAPIKeys(betterAuthResponse.data)
        : undefined,
      error: betterAuthResponse.error,
    };
  } else {
    // Unwrapped format: direct data
    return {
      data: betterAuthResponse
        ? transformBetterAuthApiKeysToAPIKeys(betterAuthResponse)
        : undefined,
      error: undefined,
    };
  }
};

/**
 * Transforms a Better-Auth updateApiKey response to AdapterResponse<APIKey>
 * Returns a function that accepts UpdateAPIKeyOptions and returns the transformed response
 * Handles both wrapped ({ data, error }) and unwrapped (direct data) response formats
 */
export const transformUpdateApiKeyResponse = (
  betterAuthFn: (options: UpdateAPIKeyOptions & { headers?: Headers | Record<string, string> }) => Promise<any>
) => async (options: UpdateAPIKeyOptions & { headers?: Headers | Record<string, string> }): Promise<{ data?: APIKey; error?: unknown }> => {
  const betterAuthResponse = await betterAuthFn(options);

  // Check if response is wrapped ({ data, error }) or unwrapped (direct data)
  const isWrapped = betterAuthResponse && ('data' in betterAuthResponse || 'error' in betterAuthResponse);

  if (isWrapped) {
    // Wrapped format: { data?, error? }
    return {
      data: betterAuthResponse.data
        ? transformBetterAuthApiKeyToAPIKey(betterAuthResponse.data)
        : undefined,
      error: betterAuthResponse.error,
    };
  } else {
    // Unwrapped format: direct data
    return {
      data: betterAuthResponse
        ? transformBetterAuthApiKeyToAPIKey(betterAuthResponse)
        : undefined,
      error: undefined,
    };
  }
};

/**
 * Transforms a Better-Auth deleteApiKey response
 * Returns a function that accepts delete options and returns the transformed response
 * Handles both wrapped ({ data, error }) and unwrapped (direct data) response formats
 */
export const transformDeleteApiKeyResponse = (
  betterAuthFn: (options: { id: string; headers?: Headers | Record<string, string> }) => Promise<any>
) => async (options: { id: string; headers?: Headers | Record<string, string> }): Promise<{ data?: { success: boolean }; error?: unknown }> => {
  const betterAuthResponse = await betterAuthFn(options);

  // Check if response is wrapped ({ data, error }) or unwrapped (direct data)
  const isWrapped = betterAuthResponse && ('data' in betterAuthResponse || 'error' in betterAuthResponse);

  if (isWrapped) {
    // Wrapped format: { data?, error? }
    return {
      data: betterAuthResponse.data,
      error: betterAuthResponse.error,
    };
  } else {
    // Unwrapped format: direct data (assume { success: boolean })
    return {
      data: betterAuthResponse,
      error: undefined,
    };
  }
};

/**
 * Transforms a Better-Auth verifyApiKey response to include transformed APIKey
 * Returns a function that accepts VerifyAPIKeyOptions and returns the transformed response
 * Handles both wrapped ({ data, error }) and unwrapped (direct data) response formats
 */
export const transformVerifyApiKeyResponse = (
  betterAuthFn: (options: VerifyAPIKeyOptions & { headers?: Headers | Record<string, string> }) => Promise<any>
) => async (options: VerifyAPIKeyOptions & { headers?: Headers | Record<string, string> }): Promise<{
  data?: {
    valid: boolean;
    apiKey?: APIKey;
    error?: string;
  };
  error?: unknown;
}> => {
  const betterAuthResponse = await betterAuthFn(options);

  // Check if response is wrapped ({ data, error }) or unwrapped (direct data)
  const isWrapped = betterAuthResponse && ('data' in betterAuthResponse || 'error' in betterAuthResponse);

  if (isWrapped) {
    // Wrapped format: { data?, error? }
    return {
      data: betterAuthResponse.data
        ? {
            valid: betterAuthResponse.data.valid,
            apiKey: betterAuthResponse.data.key
              ? transformBetterAuthApiKeyToAPIKey(betterAuthResponse.data.key)
              : undefined,
            error: betterAuthResponse.data.error ? String(betterAuthResponse.data.error) : undefined,
          }
        : undefined,
      error: betterAuthResponse.error,
    };
  } else {
    // Unwrapped format: direct data with { valid, key, error }
    return {
      data: betterAuthResponse
        ? {
            valid: betterAuthResponse.valid,
            apiKey: betterAuthResponse.key
              ? transformBetterAuthApiKeyToAPIKey(betterAuthResponse.key)
              : undefined,
            error: betterAuthResponse.error ? String(betterAuthResponse.error) : undefined,
          }
        : undefined,
      error: undefined,
    };
  }
};

// ============================================================================
// MOCK AUTH FACTORY
// ============================================================================

/**
 * Creates a frozen mock of BetterAuth with API Key plugin
 * This ensures TypeScript knows the structure is immutable
 */
export function createFrozenMockAuth(): Readonly<BetterAuthWithApiKey> {
  return Object.freeze({
    api: Object.freeze({
      createApiKey: vi.fn(),
      listApiKeys: vi.fn(),
      updateApiKey: vi.fn(),
      deleteApiKey: vi.fn(),
      verifyApiKey: vi.fn(),
    }),
  }) as unknown as Readonly<BetterAuthWithApiKey>;
}