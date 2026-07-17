import { useState } from 'react'
import { isDarkMode, setDarkMode } from '../../theme'
import { navIcons } from '../../constants/navIcons'

// Shared borderless light/dark toggle — matches the dashboard header toggle
// exactly (no border, no box-shadow, transparent). Uses the pixel-art
// light.svg / dark.svg assets at a uniform w-6 h-6 with crisp rendering.
export default function ThemeToggle() {
  const [dark, setDark] = useState(isDarkMode)

  const toggle = () => {
    const next = !dark
    setDark(next)
    setDarkMode(next)
  }

  // Show the icon for the mode you'll switch *to*: in dark mode, offer light.
  const modeIcon = dark ? navIcons.light : navIcons.dark

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="bg-transparent border-none p-0 m-0 cursor-pointer flex items-center justify-center transition-transform duration-70 active:scale-95 hover:scale-105"
      style={{ outline: 'none', boxShadow: 'none' }}
    >
      <img src={modeIcon} alt="" aria-hidden="true" className="w-6 h-6 pixel-img" />
    </button>
  )
}
