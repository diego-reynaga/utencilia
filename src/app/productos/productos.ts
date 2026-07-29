import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { Modelo3d } from './modelo3d/modelo3d';
import { Ilustracion } from './ilustracion/ilustracion';
import { ClaveFigura } from './ilustracion/figuras';

const WHATSAPP = 'https://wa.me/51938381149';

export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  categoriaLabel: string;
  descripcion: string;
  precio: string;
  valoracion: string;
  etiqueta: string | null;
  /**
   * Ruta a una foto real, p. ej. '/productos/olla.webp' con el archivo en
   * `public/productos/`. Si es null (o la imagen falla), se dibuja la
   * ilustración 2D de `figura`.
   */
  imagen: string | null;
  figura: ClaveFigura;
  enlace: string;
}

export interface Categoria {
  slug: string;
  label: string;
}

function consultar(detalle: string): string {
  return `${WHATSAPP}?text=${encodeURIComponent(`Hola, deseo consultar por ${detalle}`)}`;
}

@Component({
  selector: 'app-productos',
  imports: [Modelo3d, Ilustracion, RouterLink],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('tarjeta') private tarjetas!: QueryList<ElementRef<HTMLElement>>;

  activeFilter = 'todos';

  readonly categorias: Categoria[] = [
    { slug: 'todos', label: 'Todos' },
    { slug: 'cocina', label: 'Cocina' },
    { slug: 'mesa', label: 'Mesa' },
    { slug: 'cubiertos', label: 'Cubiertos' },
    { slug: 'organizacion', label: 'Organización' },
    { slug: 'restaurante', label: 'Restaurantes' },
  ];

  readonly productos: Producto[] = [
    {
      id: 1,
      nombre: 'Olla de acero con tapa',
      categoria: 'cocina',
      categoriaLabel: 'Cocina',
      descripcion:
        'Resistente, práctica y perfecta para el uso diario. Distribuye el calor de forma pareja y su tapa ajusta sin dejar escapar el vapor.',
      precio: 'S/ 89.90',
      valoracion: '4.9',
      etiqueta: 'Más vendido',
      imagen: null,
      figura: 'olla',
      enlace: consultar('la olla de acero con tapa'),
    },
    {
      id: 2,
      nombre: 'Sartén antiadherente',
      categoria: 'cocina',
      categoriaLabel: 'Cocina',
      descripcion:
        'Cocción uniforme con mango cómodo y seguro. El recubrimiento suelta los alimentos sin esfuerzo y se limpia en segundos.',
      precio: 'S/ 49.90',
      valoracion: '4.8',
      etiqueta: 'Nuevo',
      imagen: null,
      figura: 'sarten',
      enlace: consultar('el sartén antiadherente'),
    },
    {
      id: 3,
      nombre: 'Set de platos x12',
      categoria: 'mesa',
      categoriaLabel: 'Mesa',
      descripcion:
        'Diseño neutro y elegante para toda ocasión. Doce piezas que combinan con cualquier mantel y resisten el uso constante.',
      precio: 'S/ 74.90',
      valoracion: '4.9',
      etiqueta: null,
      imagen: null,
      figura: 'platos',
      enlace: consultar('el set de platos x12'),
    },
    {
      id: 4,
      nombre: 'Vasos de vidrio x6',
      categoria: 'mesa',
      categoriaLabel: 'Mesa',
      descripcion:
        'Clásicos, firmes y fáciles de combinar. Vidrio grueso que aguanta el lavado diario sin perder transparencia.',
      precio: 'S/ 29.90',
      valoracion: '4.7',
      etiqueta: 'Pack ahorro',
      imagen: null,
      figura: 'vasos',
      enlace: consultar('los vasos de vidrio x6'),
    },
    {
      id: 5,
      nombre: 'Juego de cubiertos x24',
      categoria: 'cubiertos',
      categoriaLabel: 'Cubiertos',
      descripcion:
        'Acabado pulido para una mesa bien presentada. Veinticuatro piezas balanceadas, cómodas en la mano y sin filos molestos.',
      precio: 'S/ 69.90',
      valoracion: '4.8',
      etiqueta: null,
      imagen: null,
      figura: 'cubiertos',
      enlace: consultar('el juego de cubiertos x24'),
    },
    {
      id: 6,
      nombre: 'Kit de utensilios x7',
      categoria: 'cocina',
      categoriaLabel: 'Cocina',
      descripcion:
        'Las herramientas esenciales siempre a la mano. Siete piezas que cubren lo que usas todos los días, sin llenar el cajón.',
      precio: 'S/ 39.90',
      valoracion: '4.9',
      etiqueta: null,
      imagen: null,
      figura: 'utensilios',
      enlace: consultar('el kit de utensilios x7'),
    },
    {
      id: 7,
      nombre: 'Contenedores herméticos',
      categoria: 'organizacion',
      categoriaLabel: 'Organización',
      descripcion:
        'Ordena y conserva tus alimentos por más tiempo. Cierre hermético, apilables y pensados para ver de un vistazo qué hay dentro.',
      precio: 'S/ 44.90',
      valoracion: '4.7',
      etiqueta: 'Práctico',
      imagen: null,
      figura: 'contenedores',
      enlace: consultar('los contenedores herméticos'),
    },
    {
      id: 8,
      nombre: 'Bandeja de servicio',
      categoria: 'restaurante',
      categoriaLabel: 'Restaurante',
      descripcion:
        'Amplia, firme y lista para el trabajo continuo. Base antideslizante y bordes reforzados para el ritmo de un salón lleno.',
      precio: 'S/ 34.90',
      valoracion: '4.9',
      etiqueta: 'Negocios',
      imagen: null,
      figura: 'bandeja',
      enlace: consultar('la bandeja de servicio'),
    },
  ];

  readonly cotizar = `${WHATSAPP}?text=${encodeURIComponent(
    'Hola Corporación Mendoza, deseo una cotización por volumen',
  )}`;

  /** Signal: el observador corre fuera de la detección de cambios y un Set
      mutado no notificaría a Angular, así que la tarjeta nunca se revelaría. */
  private readonly reveladas = signal<ReadonlySet<number>>(new Set<number>());

  private suscripcion: Subscription | null = null;
  private observador: IntersectionObserver | null = null;

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.suscripcion = this.route.queryParams.subscribe((params) => {
      this.filterProducts(params['filter'] ?? 'todos');
    });
  }

  ngAfterViewInit(): void {
    this.observador = new IntersectionObserver(
      (entradas: IntersectionObserverEntry[]) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          const id = Number((entrada.target as HTMLElement).dataset['id']);
          this.reveladas.update((previas) => new Set(previas).add(id));
          this.observador?.unobserve(entrada.target);
        }
      },
      { threshold: 0.15 },
    );

    // Las tarjetas ocultas por el filtro nunca intersectan; al mostrarse de
    // nuevo el observador las detecta sin necesidad de volver a registrarlas.
    this.tarjetas.forEach((tarjeta) => this.observador?.observe(tarjeta.nativeElement));
  }

  ngOnDestroy(): void {
    this.suscripcion?.unsubscribe();
    this.observador?.disconnect();
  }

  filterProducts(category: string): void {
    const existe = this.categorias.some((categoria) => categoria.slug === category);
    this.activeFilter = existe ? category : 'todos';
  }

  isVisible(productCategory: string): boolean {
    return this.activeFilter === 'todos' || this.activeFilter === productCategory;
  }

  get visibles(): Producto[] {
    return this.productos.filter((producto) => this.isVisible(producto.categoria));
  }

  get visibleCount(): number {
    return this.visibles.length;
  }

  estaRevelada(id: number): boolean {
    return this.reveladas().has(id);
  }

  /** Si la foto no carga, la tarjeta cae con elegancia a la ilustración 2D. */
  ocultarFoto(producto: Producto): void {
    producto.imagen = null;
  }

  irAlCatalogo(): void {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
