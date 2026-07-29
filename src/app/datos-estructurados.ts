import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SITE_URL, SITE_NAME, OG_IMAGE } from './seo';

const TELEFONO = '+51938381149';
const EMAIL = 'corporacionmendoza@gmail.com';

/** Coordenadas de Pje. Malinas 224, tomadas del embed de Google Maps. */
const LATITUD = -13.658492546588711;
const LONGITUD = -73.38688904611098;

const NEGOCIO = {
  '@context': 'https://schema.org',
  '@type': 'HomeGoodsStore',
  '@id': `${SITE_URL}/#negocio`,
  name: SITE_NAME,
  description:
    'Venta de utensilios de cocina: ollas, sartenes, platos, vasos, cubiertos y accesorios para hogar, restaurantes y negocios en Andahuaylas, Apurímac.',
  url: `${SITE_URL}/inicio`,
  image: OG_IMAGE,
  telephone: TELEFONO,
  email: EMAIL,
  priceRange: '$$',
  currenciesAccepted: 'PEN',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Pje. Malinas 224',
    addressLocality: 'Andahuaylas',
    addressRegion: 'Apurímac',
    postalCode: '03701',
    addressCountry: 'PE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: LATITUD,
    longitude: LONGITUD,
  },
  hasMap: 'https://maps.app.goo.gl/kW7Mgxn6EVzTNHho6',
  // Mismo horario que muestra la página de contacto.
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '19:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Sunday',
      opens: '09:00',
      closes: '14:00',
    },
  ],
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'Apurímac, Perú',
  },
};

const SITIO = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#sitio`,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: 'es-PE',
  publisher: { '@id': `${SITE_URL}/#negocio` },
};

@Injectable({ providedIn: 'root' })
export class DatosEstructurados {
  private readonly document = inject(DOCUMENT);

  /** Inyecta el JSON-LD en el <head>; corre en el prerender, así queda en el HTML. */
  inyectar(): void {
    const head = this.document.head;
    const ID = 'datos-estructurados';

    if (head.querySelector(`#${ID}`)) return;

    const script = this.document.createElement('script');
    script.id = ID;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify([NEGOCIO, SITIO]);
    head.appendChild(script);
  }
}
