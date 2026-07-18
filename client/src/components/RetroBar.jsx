// RetroBar — chunky stepped "health bar" progress indicator.
// The bar shows only the colored/segmented fill; the precise percentage is
// rendered by the caller to the right of the bar (see Dashboard / ProjectDetail).
// Fill color auto-maps to a completion tier (red → yellow → accent) unless an
// explicit `color` is passed.

export default function RetroBar({ value = 0, color, className = '' }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)))

  // Auto color by completion tier (overridable via the `color` prop):
  //   0–33%  low    → danger red
  //   34–74% medium → warning yellow/orange
  //   75–100 high   → active theme accent
  const tierColor =
    pct <= 33 ? 'var(--color-danger)' :
    pct <= 74 ? 'var(--color-warning)' :
    'var(--color-primary)'
  const fillColor = color || tierColor

  const segment = `repeating-linear-gradient(90deg, ${fillColor} 0, ${fillColor} 10px, rgba(0,0,0,0.18) 10px, rgba(0,0,0,0.18) 12px)`

  return (
    <div
      className={`relative h-5 w-full border-[3px] border-border bg-surface overflow-hidden pixel-corners-sm ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full transition-[width] duration-500"
        style={{ width: `${pct}%`, backgroundImage: segment }}
      />
    </div>
  )
}
