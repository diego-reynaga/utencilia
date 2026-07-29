import { Component, Suspense, useEffect, useState } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Html, OrbitControls, Stage, useGLTF } from '@react-three/drei'

/**
 * Drop a .glb into `public/`. `model.glb` is the canonical name, the rest are
 * probed as a convenience so an unrenamed export still shows up.
 */
const MODEL_CANDIDATES = ['/model.glb', '/olla3D.glb', '/scene.glb'] as const

type ModelSource =
  | { state: 'probing' }
  | { state: 'found'; url: string }
  | { state: 'missing' }

/** Resolves the first GLB that actually exists, so a missing file never throws. */
function useModelSource(): ModelSource {
  const [source, setSource] = useState<ModelSource>({ state: 'probing' })

  useEffect(() => {
    let cancelled = false

    const probe = async (): Promise<void> => {
      for (const candidate of MODEL_CANDIDATES) {
        try {
          const response = await fetch(candidate, { method: 'HEAD' })
          const contentType = response.headers.get('content-type') ?? ''
          // A dev server SPA fallback answers 200 with HTML — that is not a model.
          if (response.ok && !contentType.includes('text/html')) {
            if (!cancelled) setSource({ state: 'found', url: candidate })
            return
          }
        } catch {
          // Unreachable candidate, try the next one.
        }
      }
      if (!cancelled) setSource({ state: 'missing' })
    }

    void probe()

    return () => {
      cancelled = true
    }
  }, [])

  return source
}

type SceneBoundaryProps = {
  fallback: ReactNode
  children: ReactNode
}

type SceneBoundaryState = {
  hasError: boolean
}

/** Keeps a corrupt or unfetchable asset from taking the whole page down. */
class SceneBoundary extends Component<SceneBoundaryProps, SceneBoundaryState> {
  state: SceneBoundaryState = { hasError: false }

  static getDerivedStateFromError(): SceneBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Drift hero scene failed to load.', error, info.componentStack)
  }

  render(): ReactNode {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

function PulseDots() {
  return (
    <div className="flex items-center gap-1.5" role="status">
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white [animation-delay:150ms]" />
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white [animation-delay:300ms]" />
      <span className="sr-only">Loading the model</span>
    </div>
  )
}

function CenteredSlot({ children }: { children: ReactNode }) {
  return <div className="flex h-full w-full items-center justify-center">{children}</div>
}

function ModelPlaceholder() {
  return (
    <CenteredSlot>
      <span className="text-7xl sm:text-8xl" role="img" aria-label="3D model unavailable">
        🍳
      </span>
    </CenteredSlot>
  )
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

export default function HeroModel() {
  const source = useModelSource()

  if (source.state === 'probing') {
    return (
      <CenteredSlot>
        <PulseDots />
      </CenteredSlot>
    )
  }

  if (source.state === 'missing') {
    return <ModelPlaceholder />
  }

  return (
    <SceneBoundary fallback={<ModelPlaceholder />}>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        camera={{ fov: 40, position: [0, 0.5, 6] }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense
          fallback={
            <Html center>
              <PulseDots />
            </Html>
          }
        >
          <Stage
            adjustCamera={1}
            intensity={0.45}
            preset="rembrandt"
            shadows="contact"
            environment={null}
          >
            <Model url={source.url} />
          </Stage>
          {/* Isolated so a failed HDRI fetch dims the lighting instead of dropping the model. */}
          <SceneBoundary fallback={null}>
            <Suspense fallback={null}>
              <Environment preset="apartment" />
            </Suspense>
          </SceneBoundary>
        </Suspense>
        <OrbitControls
          makeDefault
          autoRotate
          autoRotateSpeed={0.9}
          enableZoom={false}
          enablePan={false}
        />
      </Canvas>
    </SceneBoundary>
  )
}
