import { expect, test } from 'vitest';
import { metaFetch } from '.';

test('normal case', async () => {
	const result = await metaFetch('https://qgis.org/');
	expect(result).toMatchObject({
		result: {
			title: 'Spatial without Compromise · QGIS Web Site',
			meta: {
				viewport: 'width=device-width,initial-scale=1',
				generator: 'Hugo 0.139.0',
				'twitter:card': 'summary',
				'twitter:title': 'Spatial without Compromise · QGIS Web Site',
				'og:type': 'article',
				'og:title': 'Spatial without Compromise · QGIS Web Site',
				'og:image': 'https://qgis.org/img/QGIScover.png',
			},
			favicons: [
				'https://qgis.org/favicon.ico',
				'https://qgis.org/img/favicon/favicon-32x32.png',
				'https://qgis.org/img/favicon/apple-touch-icon.png',
			],
		},
		error: null,
	});
});

test('webmanifest', async () => {
	// TODO: test webmanifest
	expect(true).toBe(true);
});

test('invalid URL', async () => {
	const result = await metaFetch('file://url/is/invalid');
	expect(result).toMatchObject({
		result: null,
		error: 'Invalid URL',
	});
});

test('notfound or server error', async () => {
	const result = await metaFetch('http://localhost:3000/notfound');
	expect(result).toMatchObject({
		result: null,
		error: 'Failed to fetch the URL',
	});
});
