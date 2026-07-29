import {
  Component,
  OnInit,
  HostListener,
  AfterViewInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Seo, SeoData } from './seo';
import { DatosEstructurados } from './datos-estructurados';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, AfterViewInit {
  isScrolled = false;
  menuOpen = false;
  currentYear = new Date().getFullYear();

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly seo = inject(Seo);
  private readonly datosEstructurados = inject(DatosEstructurados);
  private readonly route = inject(ActivatedRoute);

  constructor(private router: Router) {}

  ngOnInit(): void {
    // El SEO corre también en el servidor: así el prerender deja los meta tags
    // escritos en el HTML y los crawlers los leen sin ejecutar JavaScript.
    this.aplicarSeoDeRutaActiva();
    this.datosEstructurados.inyectar();

    if (!this.isBrowser) return;

    this.updateHeader();

    // Al cambiar de ruta, cerramos el menú y hacemos scroll arriba
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeMenu();
      window.scrollTo(0, 0);

      // Aplicar animación reveal a los nuevos elementos montados
      setTimeout(() => this.initRevealObserver(), 100);
    });
  }

  /** Lee el `data.seo` de la ruta hoja activa y lo aplica en cada navegación. */
  private aplicarSeoDeRutaActiva(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let ruta = this.route.firstChild;
          while (ruta?.firstChild) ruta = ruta.firstChild;
          return ruta?.snapshot.data['seo'] as SeoData | undefined;
        }),
        filter((datos): datos is SeoData => !!datos)
      )
      .subscribe(datos => this.seo.aplicar(datos));
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.initRevealObserver();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!this.isBrowser) return;
    this.updateHeader();
  }

  @HostListener('document:keydown.escape', [])
  onEscape(): void {
    this.closeMenu();
  }

  private updateHeader(): void {
    this.isScrolled = window.scrollY > 24;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    document.body.classList.toggle('menu-open', this.menuOpen);
  }

  closeMenu(): void {
    this.menuOpen = false;
    document.body.classList.remove('menu-open');
  }

  private initRevealObserver(): void {
    const revealElements = document.querySelectorAll('.reveal:not(.visible)');
    if (revealElements.length === 0) return;

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -35px' }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  }
}
