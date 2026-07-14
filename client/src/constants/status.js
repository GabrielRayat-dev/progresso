// Shared status / priority presentation tokens, used by the task table,
// the mobile task cards, and the StatusDropdown component.

export const statusPill = {
  todo: { className: 'text-textsecondary bg-surface border border-border', style: undefined },
  in_progress: { className: 'text-warning bg-warning/10', style: undefined },
  for_review: { className: 'text-primary bg-primary/10', style: undefined },
  done: { className: 'text-success bg-success/10', style: undefined },
  blocked: { className: 'text-danger bg-danger/10', style: undefined },
}

export const statusTint = {
  todo: 'bg-surface',
  in_progress: 'bg-warning/10',
  for_review: 'bg-primary/10',
  done: 'bg-success/10',
  blocked: 'bg-danger/10',
}

export const statusDot = {
  todo: 'bg-textsecondary',
  in_progress: 'bg-warning',
  for_review: 'bg-primary',
  done: 'bg-success',
  blocked: 'bg-danger',
}

export const statusLabels = {
  todo: 'Todo',
  in_progress: 'In progress',
  for_review: 'For review',
  done: 'Done',
  blocked: 'Blocked',
}

export const priorityDot = {
  high: 'bg-danger',
  medium: 'bg-warning',
  low: 'bg-success',
}
