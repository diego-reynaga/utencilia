import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  input,
  viewChild,
} from '@angular/core';

import { ClaveFigura, dibujarFigura, retenerLienzo, soltarLienzo } from './figuras';

/** Dibuja la figura plana de un producto con three.js sobre un canvas 2D. */
@Component({
  selector: 'app-ilustracion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas class="pv-ilustracion" role="img" [attr.aria-label]="etiqueta()" #lienzo></canvas>`,
})
export class Ilustracion implements AfterViewInit, OnDestroy {
  readonly figura = input.required<ClaveFigura>();
  readonly etiqueta = input('');

  private readonly lienzo = viewChild.required<ElementRef<HTMLCanvasElement>>('lienzo');

  private observador: ResizeObserver | null = null;

  constructor(private readonly zona: NgZone) {}

  ngAfterViewInit(): void {
    retenerLienzo();

    const canvas = this.lienzo().nativeElement;
    const medido = canvas.parentElement ?? canvas;

    // Fuera de la zona: redibujar no debe disparar detección de cambios.
    this.zona.runOutsideAngular(() => {
      this.observador = new ResizeObserver(() => void this.pintar());
      this.observador.observe(medido);
    });
  }

  ngOnDestroy(): void {
    this.observador?.disconnect();
    this.observador = null;
    soltarLienzo();
  }

  private async pintar(): Promise<void> {
    const canvas = this.lienzo().nativeElement;
    const medido = canvas.parentElement ?? canvas;
    const caja = medido.getBoundingClientRect();

    try {
      await dibujarFigura(canvas, this.figura(), Math.round(caja.width), Math.round(caja.height));
    } catch (error) {
      console.error('No se pudo dibujar la ilustración del producto.', error);
    }
  }
}
