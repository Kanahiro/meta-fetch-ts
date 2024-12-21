import { describe, it, expect, vi } from 'vitest';
import { parseMeta } from './meta';

describe('parseMeta', () => {
	it('should return metadata when the URL is valid', async () => {
		const url = 'https://example.com';
		const html = `
      <html>
        <head>
          <title>Example Title</title>
          <meta name="description" content="Example description">
          <link rel="icon" href="/favicon.ico">
        </head>
      </html>
    `;

		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			text: vi.fn().mockResolvedValue(html),
		});

		const result = await parseMeta(url);

		expect(result).toEqual({
			result: {
				title: 'Example Title',
				meta: {
					description: 'Example description',
				},
				favicons: ['https://example.com/favicon.ico'],
			},
			error: null,
		});
	});

	it('should return an error when the URL fetch fails', async () => {
		const url = 'https://example.com';

		global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

		const result = await parseMeta(url);

		expect(result).toEqual({
			result: null,
			error: 'Failed to fetch the URL',
		});
	});

	it('should return an error when the response is not ok', async () => {
		const url = 'https://example.com';

		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
		});

		const result = await parseMeta(url);

		expect(result).toEqual({
			result: null,
			error: 'Failed to fetch the URL',
		});
	});
});
