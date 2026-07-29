import { useEffect, useRef, useState } from 'react'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Drift AI', href: '#about' },
  { label: 'FAQ', href: '#faq' },
] as const

const MORPH_EASING = 'ease-[cubic-bezier(0.77,0,0.175,1)]'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const navRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <nav
      ref={navRef}
      aria-label="Main"
      className="absolute left-1/2 top-6 z-50 w-[min(22rem,calc(100%-3rem))] -translate-x-1/2"
    >
      <div className="flex items-center justify-between rounded-full bg-white px-5 py-3 shadow-2xl">
        <a
          href="#top"
          className="rounded-full text-lg font-semibold tracking-tight text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          Drift.
        </a>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="drift-nav-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="flex h-9 w-9 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          <span aria-hidden="true" className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-1/2 -mt-px h-0.5 w-full rounded-full bg-black transition-transform duration-300 ${MORPH_EASING} ${
                open ? 'translate-y-0 rotate-45' : '-translate-y-[3px] rotate-0'
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 -mt-px h-0.5 w-full rounded-full bg-black transition-transform duration-300 ${MORPH_EASING} ${
                open ? 'translate-y-0 -rotate-45' : 'translate-y-[3px] rotate-0'
              }`}
            />
          </span>
        </button>
      </div>

      <div
        id="drift-nav-menu"
        aria-hidden={!open}
        className={`absolute left-0 right-0 top-full mt-3 origin-top rounded-2xl bg-white p-2 shadow-2xl transition duration-300 ${MORPH_EASING} ${
          open
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-2 scale-95 opacity-0'
        }`}
      >
        <ul className="flex flex-col">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-drift-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
