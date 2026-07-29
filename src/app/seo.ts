import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

/** Dominio de producción. Las URLs canónicas y de Open Graph se arman desde aquí. */
export const SITE_URL = 'https://corporacionmendoza.appwrite.network';
export const SITE_NAME = 'Corporación Mendoza';

/** Imagen que se muestra al compartir el enlace en WhatsApp, Facebook o X. */
export const OG_IMAGE = `${SITE_URL}/og-image.jpeg`;

export interface SeoData {
  title: string;
  description: string;
  /** Ruta absoluta desde la raíz, ej. '/productos'. */
  path: string;
  keywords?: string;
}

@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  aplicar({ title, description, path, keywords }: SeoData): void {
    // Appwrite redirige /inicio -> /inicio/ con un 301 antes de que corra el
    // worker. Si el canónico apuntara a la URL sin barra, Google vería que la
    // página canónica redirige a otra y fallaría con "Error de redirección".
    const url = `${SITE_URL}${path}/`;

    this.title.setTitle(title);

    this.meta.updateTag({ name: 'description', content: description });
    if (keywords) {
      this.meta.updateTag({ name: 'keywords', content: keywords });
    }

    // Open Graph: WhatsApp, Facebook y LinkedIn leen estas etiquetas.
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:locale', content: 'es_PE' });
    this.meta.updateTag({ property: 'og:image', content: OG_IMAGE });
    this.meta.updateTag({ property: 'og:image:width', content: '1376' });
    this.meta.updateTag({ property: 'og:image:height', content: '768' });
    this.meta.updateTag({ property: 'og:image:alt', content: SITE_NAME });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: OG_IMAGE });

    this.actualizarCanonica(url);
  }

  /** El canonical evita que Google trate '/inicio' y '/inicio/' como páginas distintas. */
  private actualizarCanonica(url: string): void {
    const head = this.document.head;
    let enlace = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!enlace) {
      enlace = this.document.createElement('link');
      enlace.setAttribute('rel', 'canonical');
      head.appendChild(enlace);
    }

    enlace.setAttribute('href', url);
  }
}
