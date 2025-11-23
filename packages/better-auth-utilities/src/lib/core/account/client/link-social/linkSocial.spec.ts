import { describe, it, expect, vi, afterEach } from 'vitest';
import { Effect } from 'effect';
import { linkSocial } from './linkSocial.service.js';

describe('Link Social', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should initiate social linking', async () => {
		const mockLinkSocial = vi.fn().mockResolvedValue({
			data: { url: 'https://google.com/auth', redirect: true },
			error: null,
		});

		const mockAuthClient = {
			linkSocial: mockLinkSocial,
		} as any;

		const result = await Effect.runPromise(
			Effect.either(
				linkSocial({ authClient: mockAuthClient })({
					provider: 'google',
					callbackURL: '/dashboard',
				})
			)
		);

		expect(mockLinkSocial).toHaveBeenCalledWith(
			expect.objectContaining({
				provider: 'google',
				callbackURL: '/dashboard',
			})
		);
		expect(result._tag).toBe('Right');
		if (result._tag === 'Right') {
			expect(result.right.url).toBe('https://google.com/auth');
		}
	});

	it('should handle errors', async () => {
		const mockLinkSocial = vi.fn().mockResolvedValue({
			data: null,
			error: { message: 'Provider not supported', status: 400, statusText: 'Bad Request' },
		});

		const mockAuthClient = {
			linkSocial: mockLinkSocial,
		} as any;

		const result = await Effect.runPromise(
			Effect.either(
				linkSocial({ authClient: mockAuthClient })({
					provider: 'github',
				})
			)
		);

		expect(result._tag).toBe('Left');
		if (result._tag === 'Left') {
			expect(result.left.message).toBe('Provider not supported');
		}
	});
});
