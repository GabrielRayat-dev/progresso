// RetroBar — chunky stepped "health bar" progress indicator.
// The fill uses a repeating gradient to fake segmented steps, and the
// percentage is overlaid in the pixel display font. Color is passed in
// (defaults to the accent) so callers can map it to status/completion.

export default function RetroBar({ value = 0, color = 'var(--color-primary)', className = '' }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)))

  const segment = `repeating-linear-gradient(90deg, ${color} 0, ${color} 10px, rgba(0,0,0,0.18) 10px, rgba(0,0,0,0.18) 12px)`

  return (
    <div
      className={`relative h-5 w-full border-[3px] border-border bg-surface overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full transition-[width] duration-500"
        style={{ width: `${pct}%`, backgroundImage: segment }}
      />
      <span className="absolute inset-0 flex items-center justify-center font-display text-[10px] text-black">
        {pct}%
      </span>
    </div>
  )
}
