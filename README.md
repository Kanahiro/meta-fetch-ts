![GitHub Release](https://badge.fury.io/js/meta-fetcher-ts.svg)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/Kanahiro/meta-fetcher-ts/test.yml?label=test)
[![codecov](https://codecov.io/gh/Kanahiro/meta-fetcher-ts/graph/badge.svg?token=Jy2oiwr0KV)](https://codecov.io/gh/Kanahiro/meta-fetcher-ts)

# meta-fetcher-ts

A simple TypeScript library to fetch metadata from a URL.

## Acknowledgement

This library is inspired by the following projects:

- <https://github.com/rocktimsaikia/meta-fetcher>
- <https://github.com/zongyz/get-website-favicon>

## Installation

```bash
npm install meta-fetcher-ts
```

## Usage

```typescript
import { metaFetch } from 'meta-fetcher-ts';

const result = await metaFetch('https://qgis.org/');
console.log(result);
/**
{
  result: {
    title: 'Spatial without Compromise · QGIS Web Site',

    // meta tags of empty content are omitted, like <meta name="description" content="">
    meta: {
      viewport: 'width=device-width,initial-scale=1',
      generator: 'Hugo 0.139.0',
      'twitter:card': 'summary',
      'twitter:title': 'Spatial without Compromise · QGIS Web Site',
      'og:type': 'article',
      'og:title': 'Spatial without Compromise · QGIS Web Site',
      'og:image': 'https://qgis.org/img/QGIScover.png',
    },

    // URLs of favicons are resolved to absolute URLs
    favicons: [
      'https://qgis.org/favicon.ico',
      'https://qgis.org/img/favicon/favicon-32x32.png',
      'https://qgis.org/img/favicon/apple-touch-icon.png',
    ],
  },

  // Exeception won't be thrown
  error: null,
}
*/

const { result, error } = await metaFetch('invalid url');
console.log(result); // null
console.log(error); // Error: invalid url
```
