import { useState, useRef, useEffect } from 'react'

// Pixel-art chevron drawn from blocks (no native arrow, no anti-aliased curve).
function PixelChevron({ open }) {
  return (
    <svg
      viewBox="0 0 12 8"
      aria-hidden="true"
      className={`w-3 h-3 pixel-img transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="currentColor"
      shapeRendering="crispEdges"
    >
      <rect x="0" y="0" width="2" height="2" />
      <rect x="10" y="0" width="2" height="2" />
      <rect x="2" y="2" width="2" height="2" />
      <rect x="8" y="2" width="2" height="2" />
      <rect x="4" y="4" width="4" height="2" />
    </svg>
  )
}

// Custom retro dropdown — replaces the browser <select> so it matches the
// Progresso design system: thick black border, soft-rounded corners, pixel
// typography, custom chevron, and a card-styled menu panel. No system styles.
export default function CustomSelect({ value, onChange, options, className = '' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const selected = options.find((o) => o.value === value)

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return
    const onPointer = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 border-[3px] border-border bg-surface rounded-lg shadow-retro px-4 py-2.5 cursor-pointer select-none transition-colors hover:border-primary focus:outline-none"
      >
        <span
          className={`font-pixel text-xs uppercase truncate ${
            value !== 'all' && selected ? 'text-primary' : 'text-textprimary'
          }`}
        >
          {selected ? selected.label : 'Select…'}
        </span>
        <span className="text-textprimary flex-shrink-0">
          <PixelChevron open={open} />
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 mt-2 z-30 pixel-card-retro overflow-hidden"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                className={`w-full text-left px-4 py-2.5 font-pixel text-xs uppercase border-b-[3px] border-border last:border-0 transition-colors ${
                  isSelected
                    ? 'bg-primary/10 text-primary'
                    : 'text-textprimary hover:bg-background'
                }`}
              >
                <span className="truncate">{opt.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
