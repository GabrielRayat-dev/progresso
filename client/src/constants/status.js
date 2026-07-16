// Shared status / priority presentation tokens, used by the task table,
// the mobile task cards, and the StatusDropdown component.
//
// Retro reskin: each status is now a SOLID block (matches the
// Grey/Orange/Blue/Green/Red status map) with a thick token edge
// (black in light, cream in dark). Drop these className strings straight
// onto a `.badge` element.

export const statusPill = {
  todo:        { className: 'bg-[#9CA3AF] text-black border-[3px] border-border', style: undefined },
  in_progress: { className: 'bg-[#F59E0B] text-black border-[3px] border-border', style: undefined },
  for_review:  { className: 'bg-[#3B82F6] text-white border-[3px] border-border', style: undefined },
  done:        { className: 'bg-[#22C55E] text-black border-[3px] border-border', style: undefined },
  blocked:     { className: 'bg-[#EF4444] text-white border-[3px] border-border', style: undefined },
}

// Solid fills used as menu-row / chip backgrounds on hover.
export const statusTint = {
  todo: 'bg-[#9CA3AF]',
  in_progress: 'bg-[#F59E0B]',
  for_review: 'bg-[#3B82F6]',
  done: 'bg-[#22C55E]',
  blocked: 'bg-[#EF4444]',
}

// Small status dots (kept solid, matching the blocks).
export const statusDot = {
  todo: 'bg-[#9CA3AF]',
  in_progress: 'bg-[#F59E0B]',
  for_review: 'bg-[#3B82F6]',
  done: 'bg-[#22C55E]',
  blocked: 'bg-[#EF4444]',
}

export const statusLabels = {
  todo: 'Todo',
  in_progress: 'In progress',
  for_review: 'For review',
  done: 'Done',
  blocked: 'Blocked',
}

export const priorityDot = {
  high: 'bg-[#EF4444]',
  medium: 'bg-[#F59E0B]',
  low: 'bg-[#22C55E]',
}
