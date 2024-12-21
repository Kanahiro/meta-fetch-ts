import { describe, it, expect, vi } from 'vitest';
import { checkFavicon } from './favicon';

describe('checkFavicon', () => {
	it('should return the favicon URL if it exists', async () => {
		const baseUrl = 'https://example.com';
		const faviconUrl = 'https://example.com/favicon.ico';

		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
		});

		const result = await checkFavicon(baseUrl);

		expect(result).toEqual({
			result: faviconUrl,
			error: null,
		});
	});

	it('should return an error if the favicon does not exist', async () => {
		const baseUrl = 'https://example.com';

		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
		});

		const result = await checkFavicon(baseUrl);

		expect(result).toEqual({
			result: null,
			error: 'Failed to fetch the favicon',
		});
	});

	it('should return an error if fetch throws an error', async () => {
		const baseUrl = 'https://example.com';

		global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

		const result = await checkFavicon(baseUrl);

		expect(result).toEqual({
			result: null,
			error: 'Failed to fetch the favicon',
		});
	});
});
