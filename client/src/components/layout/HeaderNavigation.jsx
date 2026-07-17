import { navIcons } from '../../constants/navIcons'

// Unified 8-bit arcade navigation controls: notification bell + theme toggle.
// Both use the retro pixel-art SVG assets (bellicon.svg, light.svg, dark.svg)
// at a uniform w-6 h-6 with crisp pixelated rendering. Drop-in replacement
// for the old ThemeToggle + NotificationBell inside the header.
export default function HeaderNavigation({ isDarkMode, toggleTheme }) {
  // Show the icon for the mode you'll switch *to*: in dark mode offer light.
  const modeIcon = isDarkMode ? navIcons.light : navIcons.dark

  return (
    <div className="flex items-center gap-4">
      {/* NOTIFICATION BELL: standalone floating icon, no container borders/shadows */}
      <button
        onClick={() => console.log('Notifications clicked')}
        className="bg-transparent border-none p-0 m-0 cursor-pointer flex items-center justify-center transition-transform duration-70 active:scale-95 hover:scale-105"
        style={{ outline: 'none', boxShadow: 'none' }}
        aria-label="Notifications"
      >
        <img src={navIcons.bell} alt="" aria-hidden="true" className="w-6 h-6 pixel-img" />
      </button>

      {/* THEME TOGGLE: tactile 3D push button with dynamic color state */}
      <button
        onClick={toggleTheme}
        className={`w-11 h-11 flex items-center justify-center border-4 border-black rounded-none cursor-pointer transition-all duration-70 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#000000] ${
          isDarkMode
            ? 'bg-[#1e1b4b] shadow-[3px_3px_0px_0px_#000000]'
            : 'bg-[#93c5fd] shadow-[3px_3px_0px_0px_#000000]'
        }`}
        style={{ outline: 'none' }}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <img src={modeIcon} alt="" aria-hidden="true" className="w-6 h-6 pixel-img" />
      </button>
    </div>
  )
}
