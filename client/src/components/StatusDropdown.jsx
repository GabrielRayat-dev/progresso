import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { statusPill, statusTint, statusDot, statusLabels } from '../constants/status'

export default function StatusDropdown({ status, onChange }) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(null)
  const btnRef = useRef(null)
  const menuRef = useRef(null)
  const [pos, setPos] = useState(null)

  const close = () => {
    setOpen(false)
    setHovered(null)
  }

  // Position the portaled menu next to the trigger (right-aligned), flipping
  // above when there isn't room below. Recompute on scroll/resize so it tracks
  // the trigger even inside scrolling containers. Portaling escapes any
  // ancestor clip-path (cards now notch their corners and would otherwise
  // clip an overflowing menu).
  const place = () => {
    const b = btnRef.current
    if (!b) return
    const r = b.getBoundingClientRect()
    const menuW = 176
    const left = Math.max(8, Math.min(r.right - menuW, window.innerWidth - menuW - 8))
    const estH = menuRef.current?.offsetHeight || 220
    const placement = window.innerHeight - r.bottom < estH + 8 && r.top > estH + 8 ? 'up' : 'down'
    const top = placement === 'up' ? r.top - estH - 8 : r.bottom + 8
    setPos({ top, left })
  }

  useLayoutEffect(() => {
    if (!open) return
    place()
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [open])

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return
    const onPointer = (e) => {
      if (!e.target.closest('[data-status-dropdown]')) close()
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
        }}
        className={`badge focus:outline-none cursor-pointer gap-1.5 ${cfg.className}`}
        style={cfg.style}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${statusDot[status] || 'bg-textsecondary'}`} />
        <span>{statusLabels[status] || 'Todo'}</span>
        <i className="ti ti-chevron-down text-[10px] opacity-70" aria-hidden="true"></i>
      </button>

      {open && createPortal(
        <div
          ref={menuRef}
          data-status-dropdown="menu"
          style={{
            position: 'fixed',
            top: pos?.top ?? 0,
            left: pos?.left ?? 0,
            visibility: pos ? 'visible' : 'hidden',
            width: 176,
            zIndex: 50,
          }}
          className="pixel-card-retro overflow-hidden"
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
        </div>,
        document.body
      )}
    </div>
  )
}
