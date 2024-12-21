import { load } from 'cheerio';

type FetchedMetadata = {
	title: string;
	meta: Record<string, string>;
	favicons: string[];
};

type MetaFetchResult = {
	result: FetchedMetadata | null;
	error: string | null;
};

async function metaFetch(url: string): Promise<MetaFetchResult> {
	if (!url.startsWith('http')) {
		return {
			result: null,
			error: 'Invalid URL',
		};
	}

	let response: Response;
	try {
		response = await fetch(url);
	} catch (error) {
		return {
			result: null,
			error: 'Failed to fetch the URL',
		};
	}

	if (!response.ok) {
		return {
			result: null,
			error: 'Failed to fetch the URL',
		};
	}

	// parse the HTML
	const html = await response.text();
	const cheerio = load(html);

	// extract the title
	const title = cheerio('title').text();

	// extract meta attributes as dictionary
	const meta = cheerio('meta')
		.map((_, el) => cheerio(el).attr('name') || cheerio(el).attr('property'))
		.get()
		.reduce((acc, key) => {
			const val = cheerio(`meta[name="${key}"], meta[property="${key}"]`).attr(
				'content',
			);
			if (val) {
				const trimmed = val.trim();
				if (trimmed !== '') acc[key] = trimmed;
			}
			return acc;
		}, {} as Record<string, string>);

	const favicons = [];
	// extract favicon from http://example.com/favicon.ico
	const base = new URL(url).origin;
	const faviconUrl = new URL('favicon.ico', base).href;
	const faviconResponse = await fetch(faviconUrl);
	if (faviconResponse.ok) {
		favicons.push(faviconUrl);
	}

	// extract favicons from HTML with selectors
	const selectors = [
		"link[rel='icon' i][href]",
		"link[rel='shortcut icon' i][href]",
		"link[rel='apple-touch-icon' i][href]",
	];
	favicons.push(
		...selectors
			.map((selector) => cheerio(selector))
			.flat()
			.map((el) => {
				const href = el.attr('href') ?? el.attr('content') ?? '';
				return href;
			})
			.filter((href) => href !== ''),
	);

	return {
		result: {
			title,
			meta,
			favicons,
		},
		error: null,
	};
}

export { metaFetch };
