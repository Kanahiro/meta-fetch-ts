import { parseMeta, type Metadata } from './meta';
import { checkFavicon } from './favicon';

type MetaFetchResult =
	| {
			result: Metadata;
			error: null;
	  }
	| {
			result: null;
			error: string;
	  };

async function metaFetch(url: string): Promise<MetaFetchResult> {
	if (!url.startsWith('http')) {
		return {
			result: null,
			error: 'Invalid URL',
		};
	}

	const [meta, favicon] = await Promise.all([
		parseMeta(url),
		checkFavicon(url),
	]);

	if (meta.error !== null) {
		return meta;
	}
	if (favicon.error !== null) {
		return favicon;
	}

	return {
		result: {
			...meta.result,
			favicons: [favicon.result, ...meta.result.favicons],
		},
		error: null,
	};
}

export { metaFetch };
