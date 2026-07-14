import { useState } from 'react'
import { isDarkMode, setDarkMode } from '../../theme'

export default function ThemeToggle() {
  const [dark, setDark] = useState(isDarkMode)

  const toggle = () => {
    const next = !dark
    setDark(next)
    setDarkMode(next)
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-textsecondary hover:text-textprimary hover:bg-background transition-colors"
    >
      <i className={`ti ${dark ? 'ti-sun' : 'ti-moon'} text-base`} aria-hidden="true"></i>
    </button>
  )
}
