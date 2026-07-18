import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const projectRoot = process.cwd();
const angularBrowserOutput = join(projectRoot, 'dist', 'utensilia', 'browser');
const distRoot = join(projectRoot, 'dist');
const serverDir = join(distRoot, 'server');
const indexHtml = await readFile(join(angularBrowserOutput, 'index.html'), 'utf8');

await rm(serverDir, { recursive: true, force: true });
await cp(angularBrowserOutput, distRoot, { recursive: true });
await mkdir(serverDir, { recursive: true });

const worker = `const INDEX_HTML = ${JSON.stringify(indexHtml)};

const SECURITY_HEADERS = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin'
};

const ASSET_CACHE_CONTROL = 'public, max-age=31536000, immutable';
const DOCUMENT_CACHE_CONTROL = 'no-cache';

function withHeaders(response, cacheControl) {
  const headers = new Headers(response.headers);
  headers.set('cache-control', cacheControl);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

function htmlResponse() {
  const headers = new Headers({
    'content-type': 'text/html; charset=utf-8',
    'cache-control': DOCUMENT_CACHE_CONTROL
  });
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }
  return new Response(INDEX_HTML, { headers });
}

export default {
  async fetch(request, env) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: { allow: 'GET, HEAD' }
      });
    }

    const url = new URL(request.url);
    const assetResponse = await env.ASSETS.fetch(new Request(url, request));
    if (assetResponse.status !== 404) {
      const cacheControl = url.pathname === '/' || url.pathname.endsWith('.html')
        ? DOCUMENT_CACHE_CONTROL
        : ASSET_CACHE_CONTROL;
      return withHeaders(assetResponse, cacheControl);
    }

    return htmlResponse();
  }
};
`;

await writeFile(join(serverDir, 'index.js'), worker);
