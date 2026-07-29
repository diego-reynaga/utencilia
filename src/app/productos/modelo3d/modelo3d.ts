import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';

// Solo tipos: se borra al compilar, así three.js no entra al bundle inicial.
import type * as Tres from 'three';

type EstadoModelo = 'cargando' | 'listo' | 'error';

/** Ruta del modelo dentro de public/. */
const RUTA_MODELO = '/olla3D.glb';

@Component({
  selector: 'app-modelo3d',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pv-lienzo" [class.pv-lienzo-oculto]="estado() === 'error'" #lienzo></div>

    @if (estado() === 'cargando') {
      <div class="pv-estado" role="status">
        <span class="pv-punto"></span>
        <span class="pv-punto"></span>
        <span class="pv-punto"></span>
        <span class="pv-sr">Cargando el modelo 3D</span>
      </div>
    }

    @if (estado() === 'error') {
      <div class="pv-estado">
        <span class="pv-respaldo" role="img" aria-label="Modelo 3D no disponible">🍳</span>
      </div>
    }
  `,
})
export class Modelo3d implements AfterViewInit, OnDestroy {
  private readonly lienzo = viewChild.required<ElementRef<HTMLDivElement>>('lienzo');

  readonly estado = signal<EstadoModelo>('cargando');

  private liberar: (() => void) | null = null;

  constructor(private readonly zona: NgZone) {}

  async ngAfterViewInit(): Promise<void> {
    try {
      await this.zona.runOutsideAngular(() => this.montarEscena());
    } catch (error) {
      console.error('No se pudo cargar el modelo 3D.', error);
      this.zona.run(() => this.estado.set('error'));
    }
  }

  ngOnDestroy(): void {
    this.liberar?.();
    this.liberar = null;
  }

  private async montarEscena(): Promise<void> {
    const anfitrion = this.lienzo().nativeElement;

    const [THREE, { GLTFLoader }, { OrbitControls }, { RoomEnvironment }] = await Promise.all([
      import('three'),
      import('three/examples/jsm/loaders/GLTFLoader.js'),
      import('three/examples/jsm/controls/OrbitControls.js'),
      import('three/examples/jsm/environments/RoomEnvironment.js'),
    ]);

    const ancho = () => anfitrion.clientWidth || 1;
    const alto = () => anfitrion.clientHeight || 1;

    const renderizador = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderizador.setSize(ancho(), alto());
    renderizador.shadowMap.enabled = true;
    renderizador.shadowMap.type = THREE.PCFSoftShadowMap;
    renderizador.toneMapping = THREE.ACESFilmicToneMapping;
    renderizador.toneMappingExposure = 1.05;
    anfitrion.appendChild(renderizador.domElement);

    const escena = new THREE.Scene();

    // Iluminación neutra tipo estudio, sin descargar ningún HDRI externo.
    const pmrem = new THREE.PMREMGenerator(renderizador);
    escena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const camara = new THREE.PerspectiveCamera(40, ancho() / alto(), 0.1, 1000);

    const luzPrincipal = new THREE.DirectionalLight(0xffffff, 1.5);
    luzPrincipal.castShadow = true;
    luzPrincipal.shadow.mapSize.set(1024, 1024);
    escena.add(luzPrincipal);
    escena.add(new THREE.AmbientLight(0xffffff, 0.3));

    const controles = new OrbitControls(camara, renderizador.domElement);
    controles.autoRotate = true;
    controles.autoRotateSpeed = 0.9;
    controles.enableZoom = false;
    controles.enablePan = false;
    controles.enableDamping = true;

    const ajustarMedidas = () => {
      renderizador.setSize(ancho(), alto());
      camara.aspect = ancho() / alto();
      camara.updateProjectionMatrix();
    };

    const observador = new ResizeObserver(ajustarMedidas);
    observador.observe(anfitrion);

    let cuadro = 0;
    const animar = () => {
      cuadro = requestAnimationFrame(animar);
      controles.update();
      renderizador.render(escena, camara);
    };
    animar();

    // Se registra antes de cargar el modelo para que un fallo igual libere la GPU.
    this.liberar = () => {
      cancelAnimationFrame(cuadro);
      observador.disconnect();
      controles.dispose();
      pmrem.dispose();
      escena.traverse((objeto) => {
        const malla = objeto as Tres.Mesh;
        if (!malla.isMesh) return;
        malla.geometry.dispose();
        const material = malla.material;
        if (Array.isArray(material)) {
          material.forEach((individual) => individual.dispose());
        } else {
          material.dispose();
        }
      });
      renderizador.dispose();
      renderizador.domElement.remove();
    };

    const gltf = await new GLTFLoader().loadAsync(RUTA_MODELO);
    const modelo = gltf.scene;
    modelo.traverse((objeto) => {
      const malla = objeto as Tres.Mesh;
      if (!malla.isMesh) return;
      malla.castShadow = true;
      malla.receiveShadow = true;
    });

    // Encuadre automático: centra el modelo y aleja la cámara lo justo.
    const caja = new THREE.Box3().setFromObject(modelo);
    const medida = caja.getSize(new THREE.Vector3());
    const centro = caja.getCenter(new THREE.Vector3());
    modelo.position.sub(centro);
    escena.add(modelo);

    const mayor = Math.max(medida.x, medida.y, medida.z) || 1;
    const distancia = mayor / 2 / Math.tan((camara.fov * Math.PI) / 360);

    camara.position.set(0, mayor * 0.18, distancia * 1.7);
    camara.near = distancia / 100;
    camara.far = distancia * 100;
    camara.updateProjectionMatrix();
    controles.target.set(0, 0, 0);
    controles.update();

    luzPrincipal.position.set(mayor * 0.9, mayor * 1.5, mayor * 1.1);
    const encuadreSombra = mayor * 1.2;
    luzPrincipal.shadow.camera.left = -encuadreSombra;
    luzPrincipal.shadow.camera.right = encuadreSombra;
    luzPrincipal.shadow.camera.top = encuadreSombra;
    luzPrincipal.shadow.camera.bottom = -encuadreSombra;
    luzPrincipal.shadow.camera.far = distancia * 8;
    luzPrincipal.shadow.camera.updateProjectionMatrix();

    // Piso invisible que solo recoge la sombra de contacto.
    const piso = new THREE.Mesh(
      new THREE.PlaneGeometry(mayor * 10, mayor * 10),
      new THREE.ShadowMaterial({ opacity: 0.3 }),
    );
    piso.rotation.x = -Math.PI / 2;
    piso.position.y = -medida.y / 2;
    piso.receiveShadow = true;
    escena.add(piso);

    this.zona.run(() => this.estado.set('listo'));
  }
}
