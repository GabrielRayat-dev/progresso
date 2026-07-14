import { useState } from 'react'

const isDark = () =>
  document.documentElement.classList.contains('dark')

export default function ThemeToggle() {
  const [dark, setDark] = useState(isDark)

  const toggle = () => {
    const next = !dark
    setDark(next)
    const root = document.documentElement
    if (next) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
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
