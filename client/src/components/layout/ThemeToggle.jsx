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
      className="w-8 h-8 border-[3px] border-border bg-surface flex items-center justify-center text-textprimary shadow-retro transition-transform hover:bg-black hover:text-white active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
    >
      <i className={`ti ${dark ? 'ti-sun' : 'ti-moon'} text-base`} aria-hidden="true"></i>
    </button>
  )
}
