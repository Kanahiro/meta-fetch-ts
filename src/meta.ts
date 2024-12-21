import { load } from 'cheerio';

type Metadata = {
	title: string;
	meta: Record<string, string>;
	favicons: string[];
};

type ParseMetaResult =
	| {
			result: Metadata;
			error: null;
	  }
	| {
			result: null;
			error: string;
	  };

async function parseMeta(url: string): Promise<ParseMetaResult> {
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

	// extract favicons from HTML with selectors
	const selectors = [
		"link[rel='icon' i][href]",
		"link[rel='shortcut icon' i][href]",
		"link[rel='apple-touch-icon' i][href]",
	];
	const favicons = selectors
		.map((selector) => cheerio(selector))
		.flat()
		.map((el) => el.attr('href') ?? el.attr('content') ?? '')
		.filter((href) => href !== '')
		.map((href) => {
			if (!href.startsWith('http')) {
				// resolve relative URLs
				const base = new URL(url);
				return new URL(href, base).href;
			} else {
				// abs url
				return href;
			}
		});

	return {
		result: {
			title,
			meta,
			favicons,
		},
		error: null,
	};
}

export { parseMeta, type Metadata };
