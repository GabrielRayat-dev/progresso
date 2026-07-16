import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { statusPill, statusTint, statusDot, statusLabels } from '../constants/status'

// Walk up from the trigger to find the nearest scroll/clip container so the
// menu can flip upward before it gets cut off by overflow-hidden / scroll areas.
function findClipContainer(el) {
  let node = el.parentElement
  while (node) {
    const s = getComputedStyle(node)
    if (/(auto|hidden|scroll|clip)/.test(s.overflow + s.overflowY)) return node
    node = node.parentElement
  }
  return null
}

export default function StatusDropdown({ status, onChange }) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(null)
  const [dir, setDir] = useState('down')
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  const close = () => {
    setOpen(false)
    setHovered(null)
  }

  // Flip upward when opening near the bottom of the clipping container
  // (so the menu isn't clipped or hidden behind the bottom of the table/card).
  useLayoutEffect(() => {
    if (!open || !menuRef.current || !btnRef.current) return
    const clip = findClipContainer(btnRef.current)
    const menuRect = menuRef.current.getBoundingClientRect()
    const bound = clip ? clip.getBoundingClientRect().bottom : window.innerHeight
    setDir(menuRect.bottom > bound - 4 ? 'up' : 'down')
  }, [open])

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return
    const onPointer = (e) => {
      if (!e.target.closest('[data-status-dropdown="root"]')) close()
    }
    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const cfg = statusPill[status] || statusPill.todo

  return (
    <div className="relative inline-flex" data-status-dropdown="root" ref={btnRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
          if (!open) setDir('down')
        }}
        className={`badge focus:outline-none cursor-pointer gap-1.5 ${cfg.className}`}
        style={cfg.style}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${statusDot[status] || 'bg-textsecondary'}`} />
        <span>{statusLabels[status] || 'Todo'}</span>
        <i className="ti ti-chevron-down text-[10px] opacity-70" aria-hidden="true"></i>
      </button>

      {open && (
        <div
          ref={menuRef}
          className={`absolute right-0 w-44 bg-surface border-[3px] border-border shadow-retro overflow-hidden z-20 ${
            dir === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
        >
          {Object.entries(statusLabels).map(([val, label]) => {
            const isHovered = hovered === val
            const isCurrent = status === val
            const tintClass = isHovered ? (statusTint[val] || 'bg-surface') : ''
            return (
              <button
                key={val}
                type="button"
                onMouseEnter={() => setHovered(val)}
                onMouseLeave={() => setHovered(null)}
                onClick={(e) => {
                  e.stopPropagation()
                  onChange(val)
                  close()
                }}
                className={`w-full px-3 py-2 text-xs flex items-center gap-2 text-left transition-colors border-b-[3px] border-border last:border-0 ${
                  isCurrent ? 'font-medium' : ''
                } ${tintClass}`}
              >
                <span className={`w-1.5 h-1.5 ${statusDot[val] || 'bg-textsecondary'}`} />
                <span className="text-black">
                  {label}
                </span>
                {isCurrent && <i className="ti ti-check text-xs ml-auto text-black" aria-hidden="true"></i>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
