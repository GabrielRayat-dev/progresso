import { createContext, useContext, useState, useCallback } from 'react'
import { isDarkMode, setDarkMode } from '../theme'

// Single source of truth for Light/Dark mode. Every toggle (Navbar, the
// Settings/Appearance page, and the public-page ThemeToggle) reads from and
// writes to this context, so flipping any one immediately reflects in all of
// them. Persisting the choice + applying the `.dark` class is delegated to
// theme.js's setDarkMode (localStorage + <html> class).
const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => isDarkMode())

  const toggleTheme = useCallback(() => {
    const next = !dark
    setDark(next)
    setDarkMode(next)
  }, [dark])

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}
