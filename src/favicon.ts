type CheckFabiconResult =
	| {
			result: string;
			error: null;
	  }
	| {
			result: null;
			error: string;
	  };

/**
 * Check if the favicon exists at /favicon.ico
 */
async function checkFavicon(baseUrl: string): Promise<CheckFabiconResult> {
	const base = new URL(baseUrl).origin;
	const faviconUrl = new URL('favicon.ico', base).href;

	let response: Response;
	try {
		response = await fetch(faviconUrl);
	} catch (error) {
		return {
			result: null,
			error: 'Failed to fetch the favicon',
		};
	}

	if (response.ok) {
		return {
			result: faviconUrl,
			error: null,
		};
	} else {
		return {
			result: null,
			error: 'Failed to fetch the favicon',
		};
	}
}

export { checkFavicon };
