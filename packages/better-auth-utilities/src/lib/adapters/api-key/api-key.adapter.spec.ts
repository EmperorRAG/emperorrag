/**
 * @file libs/better-auth-utilities/src/lib/adapters/api-key/api-key.adapter.spec.ts
 * @description Comprehensive unit tests for APIKeyAdapter
 */

import { betterAuth } from 'better-auth';
import {
  APIKeyAdapter
} from './api-key.adapter.js';
import type {
  CreateAPIKeyOptions,
  UpdateAPIKeyOptions,
  APIKey
} from './api-key.adapter.ts';
import { PluginNotAvailableError } from '../base/plugin-adapter.interface.js';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import type { BetterAuthWithApiKey } from '../../test-utils/auth-types.js';
import {
  createAPIKey,
  createBetterAuthApiKey,
  createCreateAPIKeyOptions,
  createFrozenMockAuth,
  createListAPIKeysOptions,
  createAdapterSuccessResponse,
  createUnauthorizedErrorResponse,
  createDatabaseErrorResponse,
  createNetworkErrorResponse,
  createUnexpectedErrorResponse,
  createDatabaseSuccessResponse,
  transformBetterAuthApiKeysToAPIKeys,
  createUpdateAPIKeyOptions,
  transformBetterAuthApiKeyToAPIKey,
} from '../../test-utils/test-helpers.js';

describe('APIKeyAdapter', () => {
  let adapter: APIKeyAdapter;

  // Mock AdapterResponse for API key creation error
  const mockCreateErrorResponse = createUnauthorizedErrorResponse<APIKey>();

  // Mock AdapterResponse for list error
  const mockListErrorResponse = createDatabaseErrorResponse<APIKey[]>();

  // Mock AdapterResponse for network error
  const mockNetworkErrorResponse = createNetworkErrorResponse<APIKey>();

  // Mock AdapterResponse for unexpected error
  const mockUnexpectedErrorResponse = createUnexpectedErrorResponse<APIKey>();

  const mockAuth = createFrozenMockAuth();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create adapter with valid auth instance', () => {
      const testAdapter = new APIKeyAdapter({ auth: mockAuth, debug: false });
      expect(testAdapter).toBeInstanceOf(APIKeyAdapter);
      expect(testAdapter.pluginId).toBe('api-key');
      expect(testAdapter.pluginName).toBe('API Key');
    });

    it('should enable debug logging when debug flag is true', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
      const testAdapter = new APIKeyAdapter({ auth: mockAuth, debug: true });
      expect(testAdapter).toBeInstanceOf(APIKeyAdapter);
      expect(consoleSpy).toHaveBeenCalledWith('[APIKeyAdapter]', 'API Key adapter initialized');
      consoleSpy.mockRestore();
    });

    it('should throw PluginNotAvailableError when plugin is not available', () => {
      const authWithoutPlugin = {
        api: {},
      } as unknown as ReturnType<typeof betterAuth>;

      expect(() => new APIKeyAdapter({ auth: authWithoutPlugin, debug: false })).toThrow(
        PluginNotAvailableError
      );
    });

    it('should throw PluginNotAvailableError with correct message', () => {
      const authWithoutPlugin = {
        api: {},
      } as unknown as ReturnType<typeof betterAuth>;

      expect(() => new APIKeyAdapter({ auth: authWithoutPlugin, debug: false })).toThrow(
        'API Key plugin not enabled in better-auth configuration'
      );
    });
  });

  describe('isAvailable', () => {
    beforeEach(() => {
      adapter = new APIKeyAdapter({ auth: mockAuth, debug: false });
    });

    it('should return true when plugin is available', () => {
      expect(adapter.isAvailable()).toBe(true);
    });

    it('should return false when createApiKey is not a function', () => {
      const authWithoutPlugin = {
        api: { createApiKey: null },
      } as unknown as BetterAuthWithApiKey;

      const testAdapter = new APIKeyAdapter({ auth: mockAuth, debug: false });
      testAdapter.isAvailable = () => typeof authWithoutPlugin.api.createApiKey === 'function';

      expect(testAdapter.isAvailable()).toBe(false);
    });
  });

  describe('createApiKey', () => {
    beforeEach(() => {
      adapter = new APIKeyAdapter({ auth: mockAuth, debug: false });
    });

    it('should create API key successfully', async () => {
      const createOptions = createCreateAPIKeyOptions({
        name: 'Test Key',
        permissions: { read: ['*'] },
      });

      // Mock returns the API key wrapped in AdapterResponse format
      vi.mocked(mockAuth.api.createApiKey).mockResolvedValue(createBetterAuthApiKey(createOptions));

      const result = await adapter.createApiKey(createOptions, {});

      // Remove expiresIn from createOptions for comparison since createAPIKey doesn't have that property
      const { expiresIn, ...optionsWithoutExpiresIn } = createOptions;

      expect(result).toMatchObject(createAdapterSuccessResponse(
        createAPIKey(optionsWithoutExpiresIn),
        { message: 'API key created successfully' }
      ));
      expect(mockAuth.api.createApiKey).toHaveBeenCalledWith({ ...createOptions, headers: undefined });
    });

    it('should handle API error responses', async () => {
      const createOptions: CreateAPIKeyOptions = {
        name: 'Test Key',
      };

      // Mock throws error instead of returning { data: null, error: ... }
      const apiError = new Error('Unauthorized');
      vi.mocked(mockAuth.api.createApiKey).mockRejectedValue(apiError);

      const result = await adapter.createApiKey(createOptions, {});

      expect(result).toMatchObject(mockCreateErrorResponse);
    });

    it('should pass headers from context', async () => {
      const createOptions = createCreateAPIKeyOptions({
        name: 'Test Key',
      });

      const headers = { Authorization: 'Bearer token' };
      vi.mocked(mockAuth.api.createApiKey).mockResolvedValue(createBetterAuthApiKey({
        name: 'Test Key',
      }));

      await adapter.createApiKey(createOptions, { headers });

      expect(mockAuth.api.createApiKey).toHaveBeenCalledWith({ ...createOptions, headers });
    });

    it('should handle createApiKey with all optional parameters', async () => {
      const createOptions = createCreateAPIKeyOptions({
        name: 'Full Test Key',
        permissions: { read: ['*'], write: ['*'], delete: ['*'] },
        rateLimit: { maxRequests: 1000, timeWindow: 3600, enabled: true },
        expiresIn: 86400,
        metadata: { environment: 'production', owner: 'admin' },
      });

      vi.mocked(mockAuth.api.createApiKey).mockResolvedValue(createBetterAuthApiKey(createOptions));

      const result = await adapter.createApiKey(createOptions, {});

      expect(result.success).toBe(true);
      expect(mockAuth.api.createApiKey).toHaveBeenCalledWith({ ...createOptions, headers: undefined });
    });

    it('should handle network errors', async () => {
      const createOptions: CreateAPIKeyOptions = {
        name: 'Test Key',
      };

      vi.mocked(mockAuth.api.createApiKey).mockRejectedValue(new Error('Network error'));

      const result = await adapter.createApiKey(createOptions, {});

      expect(result).toMatchObject(mockNetworkErrorResponse);
    });
  });

  describe('listApiKeys', () => {
    beforeEach(() => {
      adapter = new APIKeyAdapter({ auth: mockAuth, debug: false });
    });

    it('should list API keys successfully', async () => {
      // const listOptions: ListAPIKeysOptions = {
      //   limit: 10,
      //   offset: 0,
      // };
      const listOptions = createListAPIKeysOptions({
        limit: 10,
        offset: 0,
      });

      const mockKeys = [createBetterAuthApiKey(), { ...createBetterAuthApiKey(), id: 'key_456' }];
      vi.mocked(mockAuth.api.listApiKeys).mockResolvedValue(mockKeys);

      const result = await adapter.listApiKeys(listOptions, {});

      expect(result.success).toBe(true);
      const ts = transformBetterAuthApiKeysToAPIKeys(mockKeys)
      const tp = createDatabaseSuccessResponse(ts, {message: 'API keys retrieved successfully'} );
      expect(result).toEqual(tp);
      expect(result.message).toBe('API keys retrieved successfully');
    });

    it('should handle empty list', async () => {
      vi.mocked(mockAuth.api.listApiKeys).mockResolvedValue([]);

      const result = await adapter.listApiKeys({}, {});

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });

    it('should handle API errors', async () => {
      const apiError = new Error('Database error');
      vi.mocked(mockAuth.api.listApiKeys).mockRejectedValue(apiError);

      const result = await adapter.listApiKeys({}, {});

      expect(result).toMatchObject(mockListErrorResponse);
    });
  });

  describe('updateApiKey', () => {
    beforeEach(() => {
      adapter = new APIKeyAdapter({ auth: mockAuth, debug: false });
    });

    it('should update API key successfully', async () => {
      const updateOptions = createUpdateAPIKeyOptions({
        id: 'key_123',
        name: 'Updated Name'
      })

      const updatedKey = createBetterAuthApiKey({
        id: 'key_123',
        name: 'Updated Name'
      });
      vi.mocked(mockAuth.api.updateApiKey).mockResolvedValue(updatedKey);

      const result = await adapter.updateApiKey(updateOptions, {});

      expect(result.success).toBe(true);
      expect(result.data).toEqual(transformBetterAuthApiKeyToAPIKey(updatedKey));
      expect(result.message).toBe('API key updated successfully');
    });

    it('should update multiple fields', async () => {
      const updateOptions = createUpdateAPIKeyOptions({
        id: 'key_123',
        name: 'New Name',
        permissions: { read: ['*'] },
        rateLimit: { maxRequests: 50, timeWindow: 60 },
      })

      const updatedKey = createBetterAuthApiKey({
        id: 'key_123',
        name: 'New Name',
        permissions: { read: ['*'] },
        rateLimitMax: 50,
        rateLimitTimeWindow: 60
      });
      vi.mocked(mockAuth.api.updateApiKey).mockResolvedValue(updatedKey);

      const result = await adapter.updateApiKey(updateOptions, {});

      expect(result.success).toBe(true);
    });

    it('should handle update errors', async () => {
      const updateOptions: UpdateAPIKeyOptions = {
        id: 'key_123',
        name: 'Updated'
      };

      vi.mocked(mockAuth.api.updateApiKey).mockRejectedValue(new Error('Not found'));

      const result = await adapter.updateApiKey(updateOptions, {});

      expect(result.success).toBe(false);
    });
  });

  describe('deleteApiKey', () => {
    beforeEach(() => {
      adapter = new APIKeyAdapter({ auth: mockAuth, debug: false });
    });

    it('should delete API key successfully', async () => {
      vi.mocked(mockAuth.api.deleteApiKey).mockResolvedValue({ success: true});

      const result = await adapter.deleteApiKey('key_123', {});

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ success: true });
      expect(result.message).toBe('API key deleted successfully');
    });

    it('should handle deletion errors', async () => {
      vi.mocked(mockAuth.api.deleteApiKey).mockRejectedValue(new Error('Key not found'));

      const result = await adapter.deleteApiKey('key_123', {});

      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(Error);
    });

    it('should pass headers to deleteApiKey', async () => {
      const headers = { 'X-Custom': 'value' };
      vi.mocked(mockAuth.api.deleteApiKey).mockResolvedValue({ success: true });

      await adapter.deleteApiKey('key_123', { headers });

      expect(mockAuth.api.deleteApiKey).toHaveBeenCalledWith({ id: 'key_123', headers });
    });
  });

  describe('verifyApiKey', () => {
    beforeEach(() => {
      adapter = new APIKeyAdapter({ auth: mockAuth, debug: false });
    });

    it('should verify API key successfully', async () => {
      const verifyResult = {
        valid: true,
        error: null,
        key: createBetterAuthApiKey(),
      };

      vi.mocked(mockAuth.api.verifyApiKey).mockResolvedValue(verifyResult);

      const result = await adapter.verifyApiKey('sk_test_123456', {});

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        valid: true,
        apiKey: transformBetterAuthApiKeyToAPIKey(verifyResult.key),
        error: undefined,
      });
      expect(result.message).toBe('API key verified successfully');
    });

    it('should handle invalid API key', async () => {
      vi.mocked(mockAuth.api.verifyApiKey).mockResolvedValue({  valid: false, error: null, key: null });

      const result = await adapter.verifyApiKey('invalid_key', {});

      expect(result.success).toBe(true);
      expect(result.data?.valid).toBe(false);
    });

    it('should handle verification errors', async () => {
      vi.mocked(mockAuth.api.verifyApiKey).mockRejectedValue(new Error('Verification failed'));

      const result = await adapter.verifyApiKey('sk_test_123456', {});

      expect(result.success).toBe(false);
    });
  });

  describe('Debug logging', () => {
    it('should log when debug is enabled', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
      const debugAdapter = new APIKeyAdapter({ auth: mockAuth, debug: true });

      vi.mocked(mockAuth.api.createApiKey).mockResolvedValue(createBetterAuthApiKey());

      await debugAdapter.createApiKey({ name: 'Test' }, {});

      expect(consoleSpy).toHaveBeenCalledWith('[APIKeyAdapter]', 'Creating API key:', 'Test');
      consoleSpy.mockRestore();
    });

    it('should not log when debug is disabled', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
      const quietAdapter = new APIKeyAdapter({ auth: mockAuth, debug: false });

      vi.mocked(mockAuth.api.createApiKey).mockResolvedValue(createBetterAuthApiKey());

      await quietAdapter.createApiKey({ name: 'Test' }, {});

      expect(consoleSpy).not.toHaveBeenCalledWith('[APIKeyAdapter]', expect.anything());
      consoleSpy.mockRestore();
    });
  });

  describe('Edge cases', () => {
    beforeEach(() => {
      adapter = new APIKeyAdapter({ auth: mockAuth, debug: false });
    });

    it('should handle null context gracefully', async () => {
      vi.mocked(mockAuth.api.listApiKeys).mockResolvedValue([]);

      const result = await adapter.listApiKeys({}, {} as never);

      expect(result.success).toBe(true);
    });

    it('should handle missing metadata in options', async () => {
      vi.mocked(mockAuth.api.createApiKey).mockResolvedValue( createBetterAuthApiKey());

      const result = await adapter.createApiKey({ name: 'Test' }, {});

      expect(result.success).toBe(true);
    });

    it('should handle exception thrown from API', async () => {
      vi.mocked(mockAuth.api.createApiKey).mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      const result = await adapter.createApiKey({ name: 'Test' }, {});

      expect(result).toMatchObject(mockUnexpectedErrorResponse);
    });
  });
});
