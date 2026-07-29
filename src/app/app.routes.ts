import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { Categorias } from './categorias/categorias';
import { Productos } from './productos/productos';
import { Beneficios } from './beneficios/beneficios';
import { Contacto } from './contacto/contacto';
import { SeoData } from './seo';

/** Cada ruta lleva su SEO en `data`; App lo aplica al navegar. */
export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  {
    path: 'inicio',
    component: Inicio,
    data: {
      seo: {
        title: 'Corporación Mendoza | Utensilios de cocina en Andahuaylas, Apurímac',
        description:
          'Venta de ollas, sartenes, platos, vasos y cubiertos en Andahuaylas. Utensilios resistentes para tu hogar, restaurante o negocio, con precios por volumen.',
        path: '/inicio',
        keywords:
          'utensilios de cocina Andahuaylas, ollas Apurímac, menaje para restaurantes, artículos de cocina Perú',
      } satisfies SeoData,
    },
  },
  {
    path: 'categorias',
    component: Categorias,
    data: {
      seo: {
        title: 'Categorías de utensilios | Corporación Mendoza',
        description:
          'Explora nuestras categorías: ollas y sartenes, vajilla, cubiertos, vasos y accesorios de cocina para hogar y negocio en Andahuaylas.',
        path: '/categorias',
        keywords: 'categorías utensilios cocina, ollas, vajilla, cubiertos, menaje',
      } satisfies SeoData,
    },
  },
  {
    path: 'productos',
    component: Productos,
    data: {
      seo: {
        title: 'Catálogo de productos | Corporación Mendoza',
        description:
          'Catálogo de utensilios de cocina: ollas, sartenes, bandejas, vajilla y cubiertos. Cotiza por volumen para tu restaurante o negocio en Apurímac.',
        path: '/productos',
        keywords: 'catálogo utensilios cocina, comprar ollas Andahuaylas, venta mayorista menaje',
      } satisfies SeoData,
    },
  },
  {
    path: 'beneficios',
    component: Beneficios,
    data: {
      seo: {
        title: 'Por qué elegirnos | Corporación Mendoza',
        description:
          'Productos seleccionados, atención personalizada, precios mayoristas y entregas coordinadas en Andahuaylas y toda la región Apurímac.',
        path: '/beneficios',
        keywords: 'beneficios, precios mayoristas utensilios, entrega Andahuaylas',
      } satisfies SeoData,
    },
  },
  {
    path: 'contacto',
    component: Contacto,
    data: {
      seo: {
        title: 'Contacto y ubicación | Corporación Mendoza',
        description:
          'Visítanos en Pje. Malinas 224, Andahuaylas, Apurímac. Escríbenos al 938 381 149 por WhatsApp para cotizar utensilios para tu hogar o negocio.',
        path: '/contacto',
        keywords:
          'contacto Corporación Mendoza, tienda utensilios Andahuaylas, Pje. Malinas 224, teléfono',
      } satisfies SeoData,
    },
  },
  { path: '**', redirectTo: 'inicio' },
];
