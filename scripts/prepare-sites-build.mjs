import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const projectRoot = process.cwd();
const angularBrowserOutput = join(projectRoot, 'dist', 'utensilia', 'browser');
const distRoot = join(projectRoot, 'dist');
const serverDir = join(distRoot, 'server');

/** Rutas prerenderizadas: cada una tiene su propio HTML con meta tags y contenido. */
const RUTAS_PRERENDERIZADAS = ['inicio', 'categorias', 'productos', 'beneficios', 'contacto'];

await rm(serverDir, { recursive: true, force: true });
await cp(angularBrowserOutput, distRoot, { recursive: true });
await mkdir(serverDir, { recursive: true });

// El worker embebe el HTML de cada ruta para responder sin tocar el disco.
const paginas = {};
for (const ruta of RUTAS_PRERENDERIZADAS) {
  paginas[`/${ruta}`] = await readFile(join(angularBrowserOutput, ruta, 'index.html'), 'utf8');
}

// El index.html de la raíz sólo contiene el redirect del router ("Redirecting"),
// sin contenido ni meta tags: servirlo dejaría la home vacía para los crawlers.
// Por eso la raíz responde con el HTML completo de /inicio.
const indexHtml = await readFile(join(angularBrowserOutput, 'index.html'), 'utf8');
paginas['/'] = paginas['/inicio'] ?? indexHtml;

const worker = `const PAGINAS = ${JSON.stringify(paginas)};
const NO_ENCONTRADA = ${JSON.stringify(paginas['/inicio'] ?? indexHtml)};

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

function htmlResponse(html, status = 200) {
  const headers = new Headers({
    'content-type': 'text/html; charset=utf-8',
    'cache-control': DOCUMENT_CACHE_CONTROL
  });
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }
  return new Response(html, { status, headers });
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

    // Appwrite ya redirige /inicio -> /inicio/ antes de llegar aquí, así que
    // ambas formas deben resolver a la misma página: se quita la barra final
    // sólo para buscar en PAGINAS, sin redirigir de nuevo.
    const ruta = url.pathname.length > 1 && url.pathname.endsWith('/')
      ? url.pathname.slice(0, -1)
      : url.pathname;

    // Cada ruta prerenderizada se sirve con su propio HTML, no con el de inicio:
    // de lo contrario los crawlers verían siempre los mismos meta tags.
    const pagina = PAGINAS[ruta];
    if (pagina) {
      return htmlResponse(pagina);
    }

    const assetResponse = await env.ASSETS.fetch(new Request(url, request));
    if (assetResponse.status !== 404) {
      const cacheControl = ruta === '/' || ruta.endsWith('.html')
        ? DOCUMENT_CACHE_CONTROL
        : ASSET_CACHE_CONTROL;
      return withHeaders(assetResponse, cacheControl);
    }

    // 404 real para que Google no indexe rutas inexistentes como si fueran válidas.
    return htmlResponse(NO_ENCONTRADA, 404);
  }
};
`;

await writeFile(join(serverDir, 'index.js'), worker);

console.log(`Worker generado con ${Object.keys(paginas).length} páginas prerenderizadas.`);
