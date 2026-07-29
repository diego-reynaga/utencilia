// Solo tipos: three.js se carga de forma diferida más abajo.
import type * as Tres from 'three';

type Modulo = typeof import('three');

export type ClaveFigura =
  | 'olla'
  | 'sarten'
  | 'platos'
  | 'vasos'
  | 'cubiertos'
  | 'utensilios'
  | 'contenedores'
  | 'bandeja';

/** Primitivas planas con las que se compone cada ilustración. */
type Primitiva =
  | { tipo: 'rect'; x: number; y: number; w: number; h: number; r?: number; op?: number }
  | { tipo: 'marco'; x: number; y: number; w: number; h: number; r?: number; grosor: number; op?: number }
  | { tipo: 'circulo'; x: number; y: number; r: number; op?: number }
  | { tipo: 'anillo'; x: number; y: number; r: number; grosor: number; op?: number }
  | { tipo: 'poli'; puntos: readonly (readonly [number, number])[]; op?: number };

const COLOR = 0xf8f5ef;

/** Lienzo lógico en el que están dibujadas todas las figuras (16:9). */
const MUNDO_ANCHO = 100;
const MUNDO_ALTO = 56.25;

/** Margen alrededor de la figura, como fracción del lado más ajustado. */
const MARGEN = 0.88;

function vaso(cx: number, base: number, alto: number, abajo: number, arriba: number, op: number): Primitiva {
  return {
    tipo: 'poli',
    op,
    puntos: [
      [cx - abajo / 2, base],
      [cx + abajo / 2, base],
      [cx + arriba / 2, base + alto],
      [cx - arriba / 2, base + alto],
    ],
  };
}

const FIGURAS: Record<ClaveFigura, readonly Primitiva[]> = {
  olla: [
    { tipo: 'rect', x: 0, y: -6, w: 44, h: 26, r: 4, op: 0.92 },
    { tipo: 'marco', x: -26.5, y: -3, w: 11, h: 12, r: 6, grosor: 2.4, op: 0.6 },
    { tipo: 'marco', x: 26.5, y: -3, w: 11, h: 12, r: 6, grosor: 2.4, op: 0.6 },
    { tipo: 'rect', x: 0, y: 9, w: 52, h: 5, r: 2.5, op: 0.78 },
    { tipo: 'circulo', x: 0, y: 14.6, r: 3.2, op: 0.78 },
    { tipo: 'rect', x: 0, y: -1, w: 30, h: 1.4, r: 0.7, op: 0.26 },
  ],
  sarten: [
    { tipo: 'rect', x: 25, y: 1, w: 26, h: 4.6, r: 2.3, op: 0.7 },
    { tipo: 'rect', x: -6, y: -3, w: 40, h: 19, r: 8, op: 0.92 },
    { tipo: 'marco', x: -6, y: -3, w: 30, h: 11, r: 5, grosor: 1.4, op: 0.3 },
  ],
  platos: [
    { tipo: 'anillo', x: 0, y: 4, r: 17, grosor: 2.2, op: 0.85 },
    { tipo: 'anillo', x: 0, y: 4, r: 10.5, grosor: 1.5, op: 0.45 },
    { tipo: 'rect', x: 0, y: -16, w: 34, h: 3.6, r: 1.8, op: 0.55 },
    { tipo: 'rect', x: 0, y: -21.5, w: 28, h: 3.6, r: 1.8, op: 0.32 },
  ],
  vasos: [
    vaso(-17, -16, 26, 12, 15, 0.55),
    vaso(0, -16, 32, 13, 16, 0.9),
    vaso(17, -16, 26, 12, 15, 0.55),
  ],
  cubiertos: [
    { tipo: 'rect', x: -20, y: -6, w: 4, h: 24, r: 2, op: 0.85 },
    { tipo: 'rect', x: -20, y: 7, w: 8.5, h: 5, r: 1.6, op: 0.85 },
    { tipo: 'rect', x: -23, y: 13.5, w: 2, h: 9, r: 1, op: 0.85 },
    { tipo: 'rect', x: -20, y: 13.5, w: 2, h: 9, r: 1, op: 0.85 },
    { tipo: 'rect', x: -17, y: 13.5, w: 2, h: 9, r: 1, op: 0.85 },
    { tipo: 'rect', x: 0, y: -8, w: 4, h: 20, r: 2, op: 0.7 },
    { tipo: 'poli', op: 0.7, puntos: [[-2.4, 1], [2.4, 1], [1.8, 19], [-2.4, 15]] },
    { tipo: 'rect', x: 20, y: -6, w: 4, h: 22, r: 2, op: 0.85 },
    { tipo: 'circulo', x: 20, y: 12.5, r: 5.4, op: 0.85 },
  ],
  utensilios: [
    { tipo: 'rect', x: -18, y: -6, w: 3.6, h: 22, r: 1.8, op: 0.85 },
    { tipo: 'rect', x: -18, y: 10, w: 11, h: 11, r: 2.4, op: 0.68 },
    { tipo: 'rect', x: 0, y: -6, w: 3.6, h: 22, r: 1.8, op: 0.9 },
    { tipo: 'circulo', x: 0, y: 12, r: 5.6, op: 0.9 },
    { tipo: 'rect', x: 18, y: -6, w: 3.6, h: 22, r: 1.8, op: 0.85 },
    { tipo: 'anillo', x: 18, y: 11.5, r: 5.4, grosor: 1.6, op: 0.85 },
  ],
  contenedores: [
    { tipo: 'rect', x: 0, y: 13, w: 30, h: 9, r: 2.2, op: 0.85 },
    { tipo: 'rect', x: 0, y: 18.6, w: 34, h: 3, r: 1.5, op: 0.6 },
    { tipo: 'rect', x: 0, y: 1, w: 26, h: 8.4, r: 2.2, op: 0.68 },
    { tipo: 'rect', x: 0, y: 6.2, w: 30, h: 3, r: 1.5, op: 0.48 },
    { tipo: 'rect', x: 0, y: -10, w: 22, h: 7.6, r: 2.2, op: 0.52 },
    { tipo: 'rect', x: 0, y: -5.4, w: 26, h: 3, r: 1.5, op: 0.36 },
  ],
  bandeja: [
    { tipo: 'rect', x: 0, y: 0, w: 56, h: 26, r: 5, op: 0.85 },
    { tipo: 'marco', x: -31, y: 0, w: 10, h: 12, r: 6, grosor: 2.2, op: 0.55 },
    { tipo: 'marco', x: 31, y: 0, w: 10, h: 12, r: 6, grosor: 2.2, op: 0.55 },
    { tipo: 'marco', x: 0, y: 0, w: 46, h: 17, r: 3, grosor: 1.4, op: 0.35 },
  ],
};

function formaRect(THREE: Modulo, w: number, h: number, r: number): Tres.Shape {
  const forma = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  const rr = Math.max(0, Math.min(r, w / 2, h / 2));

  forma.moveTo(x + rr, y);
  forma.lineTo(x + w - rr, y);
  forma.quadraticCurveTo(x + w, y, x + w, y + rr);
  forma.lineTo(x + w, y + h - rr);
  forma.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  forma.lineTo(x + rr, y + h);
  forma.quadraticCurveTo(x, y + h, x, y + h - rr);
  forma.lineTo(x, y + rr);
  forma.quadraticCurveTo(x, y, x + rr, y);

  return forma;
}

function construirForma(
  THREE: Modulo,
  p: Primitiva,
): { forma: Tres.Shape; x: number; y: number } {
  switch (p.tipo) {
    case 'rect':
      return { forma: formaRect(THREE, p.w, p.h, p.r ?? 0), x: p.x, y: p.y };

    case 'marco': {
      const forma = formaRect(THREE, p.w, p.h, p.r ?? 0);
      forma.holes.push(
        formaRect(THREE, p.w - p.grosor * 2, p.h - p.grosor * 2, Math.max((p.r ?? 0) - p.grosor, 0)),
      );
      return { forma, x: p.x, y: p.y };
    }

    case 'circulo': {
      const forma = new THREE.Shape();
      forma.absarc(0, 0, p.r, 0, Math.PI * 2, false);
      return { forma, x: p.x, y: p.y };
    }

    case 'anillo': {
      const forma = new THREE.Shape();
      forma.absarc(0, 0, p.r, 0, Math.PI * 2, false);
      const hueco = new THREE.Path();
      hueco.absarc(0, 0, Math.max(p.r - p.grosor, 0.01), 0, Math.PI * 2, true);
      forma.holes.push(hueco);
      return { forma, x: p.x, y: p.y };
    }

    case 'poli': {
      const forma = new THREE.Shape();
      p.puntos.forEach(([x, y], indice) => (indice === 0 ? forma.moveTo(x, y) : forma.lineTo(x, y)));
      forma.closePath();
      return { forma, x: 0, y: 0 };
    }
  }
}

/* --- Renderizador compartido -------------------------------------------
   Un único contexto WebGL para todas las tarjetas: se dibuja bajo demanda
   y el resultado se copia al canvas 2D de cada tarjeta. Así ocho productos
   no consumen ocho contextos ni ocho bucles de animación. */

let tres: Modulo | null = null;
let renderizador: Tres.WebGLRenderer | null = null;
let consumidores = 0;

async function cargarTres(): Promise<Modulo> {
  tres ??= await import('three');
  return tres;
}

export function retenerLienzo(): void {
  consumidores += 1;
}

export function soltarLienzo(): void {
  consumidores = Math.max(0, consumidores - 1);
  if (consumidores === 0 && renderizador) {
    renderizador.dispose();
    renderizador.forceContextLoss();
    renderizador = null;
  }
}

export async function dibujarFigura(
  destino: HTMLCanvasElement,
  clave: ClaveFigura,
  ancho: number,
  alto: number,
): Promise<void> {
  if (ancho <= 0 || alto <= 0) return;

  const THREE = await cargarTres();
  const dpr = Math.min(window.devicePixelRatio, 2);

  renderizador ??= new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true,
  });
  renderizador.setPixelRatio(dpr);
  renderizador.setSize(ancho, alto, false);

  const escena = new THREE.Scene();
  const geometrias: Tres.BufferGeometry[] = [];
  const materiales: Tres.Material[] = [];

  for (const primitiva of FIGURAS[clave]) {
    const { forma, x, y } = construirForma(THREE, primitiva);
    const geometria = new THREE.ShapeGeometry(forma, 24);
    const material = new THREE.MeshBasicMaterial({
      color: COLOR,
      depthWrite: false,
      opacity: primitiva.op ?? 1,
      transparent: true,
    });

    const malla = new THREE.Mesh(geometria, material);
    malla.position.set(x, y, 0);
    escena.add(malla);

    geometrias.push(geometria);
    materiales.push(material);
  }

  // Encaje "contain": la figura ocupa el espacio disponible sin recortarse
  // y sin deformarse, sea cual sea el aspecto de la tarjeta.
  const escala = Math.min(ancho / MUNDO_ANCHO, alto / MUNDO_ALTO) * MARGEN;
  const camaraAncho = ancho / escala;
  const camaraAlto = alto / escala;

  const camara = new THREE.OrthographicCamera(
    -camaraAncho / 2,
    camaraAncho / 2,
    camaraAlto / 2,
    -camaraAlto / 2,
    0.1,
    100,
  );
  camara.position.z = 10;

  renderizador.render(escena, camara);

  destino.width = Math.round(ancho * dpr);
  destino.height = Math.round(alto * dpr);
  const contexto = destino.getContext('2d');
  if (contexto) {
    contexto.clearRect(0, 0, destino.width, destino.height);
    contexto.drawImage(renderizador.domElement, 0, 0, destino.width, destino.height);
  }

  geometrias.forEach((geometria) => geometria.dispose());
  materiales.forEach((material) => material.dispose());
}
