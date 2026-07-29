import { Mail, Plus } from 'lucide-react'
import { BrandMark } from './BrandMark'

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative z-10 rounded-t-[25px] bg-drift-sand px-6 py-24 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-lg leading-relaxed text-drift-ink sm:text-xl">
          We craft tools that move with your rhythm, not over it. Designed for ease, presence, and
          flow.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            className="inline-flex items-center gap-3 rounded-full bg-drift-ink py-2 pl-2 pr-6 text-xs font-medium uppercase tracking-[0.18em] text-drift-cream transition-colors hover:bg-drift-ink-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-drift-ink focus-visible:ring-offset-2 focus-visible:ring-offset-drift-sand"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <Mail size={16} className="text-drift-ink" aria-hidden="true" />
            </span>
            Say hello
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-3 rounded-full bg-drift-muted py-2 pl-2 pr-6 text-xs font-medium uppercase tracking-[0.18em] text-drift-ink transition-colors hover:bg-drift-muted-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-drift-ink focus-visible:ring-offset-2 focus-visible:ring-offset-drift-sand"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <Plus size={16} className="text-drift-ink" aria-hidden="true" />
            </span>
            Stay informed
          </button>
        </div>
      </div>

      <div aria-hidden="true" className="mt-20 flex w-full items-center gap-3">
        <span className="h-2 w-2 shrink-0 rounded-full bg-drift-muted" />
        <span className="h-0.5 flex-1 bg-drift-muted" />
        <span className="h-2 w-2 shrink-0 rounded-full bg-drift-muted" />
      </div>

      <div
        id="faq"
        className="mx-auto mt-20 flex max-w-6xl flex-col gap-10 md:flex-row md:gap-16 lg:gap-24"
      >
        <div className="flex shrink-0 flex-col gap-4">
          <BrandMark fill="#321C04" />
          <p className="text-[10px] font-semibold uppercase leading-relaxed tracking-[0.25em] text-drift-ink">
            <span className="block">Calm</span>
            <span className="block">Amplified</span>
          </p>
        </div>

        <p className="text-[clamp(1.5rem,3.4vw,42px)] font-normal leading-[1.3] text-drift-ink">
          We make AI tools and assistants. But, most importantly, we help you remember what gentle
          productivity looks like when software moves with you, not over you. We create systems that
          carry the cognitive weight, so you can attend to what truly counts.
        </p>
      </div>
    </section>
  )
}
