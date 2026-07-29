import { useCallback, useEffect, useRef, useState } from 'react'
import { BrandMark } from './BrandMark'
import { CtaBar } from './CtaBar'

const BACKGROUND_IMAGE =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260709_082449_46df5cc4-ad98-4541-9236-a2659c1478a4.png&w=1920&q=85'

type Feature = {
  title: string
  description: string
  video: string
}

const FEATURES: Feature[] = [
  {
    title: 'Built for ease, not urgency',
    description:
      'Drift strips away the noise that makes organizing feel draining. Every surface is made to be soft, quiet, and intuitive so you can move forward, not get stuck decoding.',
    video:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_102608_5fa1187d-9ac6-44fb-82ab-54376200abc0.mp4',
  },
  {
    title: 'The gentlest way to start',
    description:
      'Beginning your day should feel natural, not daunting. Drift eases you into motion with subtle cues and a quiet view of what deserves your energy right now.',
    video:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260625_174131_395bc785-bb21-4e65-abf6-27c56f0764b6.mp4',
  },
  {
    title: 'Deep, undivided focus',
    description:
      'No interruptions, no clutter. Drift holds you in the present task with a stripped-back layout that softens all else until you are truly ready to shift.',
    video:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260525_052706_d2e390fd-1846-4fe7-a4d8-8d2f1c875358.mp4',
  },
]

type FeatureCardProps = {
  feature: Feature
  index: number
  onActivate: (index: number) => void
  registerRef: (index: number, node: HTMLElement | null) => void
}

function FeatureCard({ feature, index, onActivate, registerRef }: FeatureCardProps) {
  const cardRef = useRef<HTMLElement | null>(null)
  const [revealed, setRevealed] = useState(false)

  const setRefs = useCallback(
    (node: HTMLElement | null) => {
      cardRef.current = node
      registerRef(index, node)
    },
    [index, registerRef],
  )

  useEffect(() => {
    const node = cardRef.current
    if (!node) return

    const revealObserver = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true)
            revealObserver.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15 },
    )

    const activeObserver = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onActivate(index)
        }
      },
      { threshold: 0.6 },
    )

    revealObserver.observe(node)
    activeObserver.observe(node)

    return () => {
      revealObserver.disconnect()
      activeObserver.disconnect()
    }
  }, [index, onActivate])

  return (
    <article
      ref={setRefs}
      className={`rounded-[2rem] bg-black/20 p-6 backdrop-blur-md transition-all duration-700 ease-out sm:p-10 ${
        revealed ? 'translate-x-0 opacity-100' : 'translate-x-16 opacity-0'
      }`}
    >
      <BrandMark fill="rgba(255,255,255,0.8)" />

      <h3 className="mt-6 text-2xl font-medium text-white">{feature.title}</h3>

      <div className="mt-6 aspect-video w-full overflow-hidden rounded-2xl bg-black/40">
        <video
          className="h-full w-full object-cover"
          src={feature.video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>

      <p className="mt-6 text-sm font-medium leading-relaxed text-white/60 sm:text-base">
        {feature.description}
      </p>
    </article>
  )
}

export function FeaturesSection() {
  const cardRefs = useRef<Array<HTMLElement | null>>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const registerRef = useCallback((index: number, node: HTMLElement | null) => {
    cardRefs.current[index] = node
  }, [])

  const handleActivate = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  const scrollToCard = (index: number) => {
    cardRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <section id="features" className="relative px-6 py-24 sm:px-10 lg:px-16 lg:py-32 xl:px-24">
      {/* Negative z-index keeps the fixed backdrop behind every section above it. */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-drift-ink bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${BACKGROUND_IMAGE}")` }}
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-[400px_1fr] lg:gap-20 xl:grid-cols-[460px_1fr] xl:gap-28">
        <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:py-24">
          <div>
            <h2 className="text-4xl font-normal leading-tight text-white xl:text-[46px]">
              Software that flows with your mind, not over it
            </h2>

            <div className="mt-10 hidden flex-col items-start gap-3 lg:flex">
              {FEATURES.map((feature, index) => (
                <button
                  key={feature.title}
                  type="button"
                  onClick={() => scrollToCard(index)}
                  aria-current={activeIndex === index}
                  className={`rounded-full bg-black/20 px-5 py-3 text-left text-sm font-medium backdrop-blur-md transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    activeIndex === index ? 'text-white' : 'text-white/40'
                  }`}
                >
                  {feature.title}
                </button>
              ))}
            </div>
          </div>

          <CtaBar className="mt-16 hidden lg:flex">
            Quiet software for busy minds.
          </CtaBar>
        </div>

        <div className="flex flex-col gap-10 sm:gap-16">
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index}
              onActivate={handleActivate}
              registerRef={registerRef}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
