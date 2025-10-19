import { vi } from 'vitest';
import type { BetterAuthWithApiKey } from './auth-types.js';

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