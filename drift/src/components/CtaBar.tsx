import type { ReactNode } from 'react'

type CtaBarProps = {
  children: ReactNode
  className?: string
}

/**
 * Frosted glass bar holding a short line of copy and the primary call to action.
 * Shared by the hero and the sticky features column so both read identically.
 */
export function CtaBar({ children, className = '' }: CtaBarProps) {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-xl bg-black/25 p-2 pl-4 backdrop-blur-md ${className}`}
    >
      <p className="text-sm font-medium leading-snug text-white/80">{children}</p>
      <button
        type="button"
        className="shrink-0 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
      >
        Start for free
      </button>
    </div>
  )
}
