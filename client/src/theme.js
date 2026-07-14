// Centralized theme helpers: light/dark mode + accent color theme.
// Both are stored in localStorage and applied as classes on <html> so the
// CSS tokens (--color-primary, etc.) drive the whole UI.

export const COLOR_THEMES = [
  { id: 'green', label: 'Green', value: '#16A34A' },
  { id: 'blue', label: 'Blue', value: '#3B82F6' },
  { id: 'purple', label: 'Purple', value: '#8B5CF6' },
  { id: 'orange', label: 'Orange', value: '#F97316' },
]

export const DEFAULT_COLOR_THEME = 'green'

export function getColorTheme() {
  try {
    const saved = localStorage.getItem('colorTheme')
    if (COLOR_THEMES.some(t => t.id === saved)) return saved
  } catch (e) {}
  return DEFAULT_COLOR_THEME
}

// Apply a color theme by toggling theme-* classes on <html>.
// Green (the default) needs no class — it's the base token in index.css.
export function applyColorTheme(theme = getColorTheme()) {
  const root = document.documentElement
  COLOR_THEMES.forEach(t => root.classList.remove('theme-' + t.id))
  if (theme && theme !== DEFAULT_COLOR_THEME) root.classList.add('theme-' + theme)
}

export function setColorTheme(theme) {
  const id = COLOR_THEMES.some(t => t.id === theme) ? theme : DEFAULT_COLOR_THEME
  try { localStorage.setItem('colorTheme', id) } catch (e) {}
  applyColorTheme(id)
  return id
}

export function isDarkMode() {
  return document.documentElement.classList.contains('dark')
}

export function setDarkMode(dark) {
  const root = document.documentElement
  if (dark) {
    root.classList.add('dark')
    try { localStorage.setItem('theme', 'dark') } catch (e) {}
  } else {
    root.classList.remove('dark')
    try { localStorage.setItem('theme', 'light') } catch (e) {}
  }
}
