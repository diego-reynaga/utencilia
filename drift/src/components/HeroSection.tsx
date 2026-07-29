import HeroModel from './HeroModel'
import { CtaBar } from './CtaBar'

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative -mb-[25px] h-screen min-h-[640px] w-full overflow-hidden"
    >
      {/* Warm base gradient drawn from the brand palette. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(150deg,#1F1003_0%,#321C04_45%,#5A3410_100%)]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/20" />

      <div className="relative grid h-full grid-cols-1 grid-rows-[auto_1fr] md:grid-cols-2 md:grid-rows-1">
        <div className="flex animate-fade-in-down flex-col justify-end px-6 pb-10 pt-28 sm:px-10 md:pb-16 lg:px-16 lg:pb-20">
          <h1 className="text-5xl font-normal leading-none tracking-tight text-white sm:text-6xl lg:text-7xl">
            <span className="block">Own your time</span>
            <span className="block">
              without{' '}
              <em className="italic" style={{ fontFamily: '"Instrument Serif", serif' }}>
                the stress
              </em>
            </span>
          </h1>

          <p className="mt-6 max-w-[420px] font-medium leading-relaxed text-white/80">
            Drift is a calm, ADHD-friendly planner that turns scattered ideas into a clear path
          </p>

          <CtaBar className="mt-8 w-full max-w-xl">
            <span className="hidden sm:inline">
              No noise. No complicated systems. Just your day, gently sorted.
            </span>
            <span className="sm:hidden">No noise. Just your day, gently sorted.</span>
          </CtaBar>
        </div>

        <div className="relative h-full w-full min-h-[18rem] bg-[radial-gradient(100%_80%_at_50%_45%,rgba(246,228,207,0.28)_0%,rgba(217,196,170,0.14)_45%,transparent_75%)]">
          <HeroModel />
        </div>
      </div>
    </section>
  )
}
