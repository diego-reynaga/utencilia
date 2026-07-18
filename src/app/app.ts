import {
  Component,
  OnInit,
  HostListener,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

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

  constructor(private router: Router) {}

  ngOnInit(): void {
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

  ngAfterViewInit(): void {
    this.initRevealObserver();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
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
