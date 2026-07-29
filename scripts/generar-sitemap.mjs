import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const SITE_URL = 'https://corporacionmendoza.appwrite.network';

/** Prioridad relativa dentro del sitio: inicio manda, el resto acompaña. */
const RUTAS = [
  { ruta: '/inicio', prioridad: '1.0', frecuencia: 'weekly' },
  { ruta: '/productos', prioridad: '0.9', frecuencia: 'weekly' },
  { ruta: '/categorias', prioridad: '0.8', frecuencia: 'monthly' },
  { ruta: '/beneficios', prioridad: '0.7', frecuencia: 'monthly' },
  { ruta: '/contacto', prioridad: '0.7', frecuencia: 'monthly' },
];

const hoy = new Date().toISOString().split('T')[0];

// La barra final es obligatoria: Appwrite redirige /inicio -> /inicio/, y el
// sitemap debe listar la URL final para que coincida con el canónico.
const urls = RUTAS.map(
  ({ ruta, prioridad, frecuencia }) => `  <url>
    <loc>${SITE_URL}${ruta}/</loc>
    <lastmod>${hoy}</lastmod>
    <changefreq>${frecuencia}</changefreq>
    <priority>${prioridad}</priority>
  </url>`,
).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const destino = join(process.cwd(), 'public', 'sitemap.xml');
await writeFile(destino, sitemap);

console.log(`sitemap.xml generado con ${RUTAS.length} rutas (${hoy}).`);
