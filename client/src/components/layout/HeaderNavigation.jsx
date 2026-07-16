// Chunky Pixel Sun SVG (For Light Mode Toggle)
const PixelSun = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2h4v2h-4V2zm0 18h4v2h-4v-2zM2 10h2v4H2v-4zm18 0h2v4h-2v-4zm-4-4h2v2h-2V6zM6 6h2v2H6V6zm10 10h2v2h-2v-2zM6 16h2v2H6v-2zM8 8h8v8H8V8z" fill="#facc15"/>
  </svg>
);

// Chunky Pixel Moon SVG (For Dark Mode Toggle)
const PixelMoon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 4h4v2h-4V4zm4 2h2v2h-2V6zm2 2h2v4h-2V8zm0 4h-2v2h2v-2zm-2 2h-2v2h2v-2zm-2 2H8v2h4v-2zm-4-2H6v-2h2v2zm-2-2H4V8h2v4zm0-4h2V6H6v2zm2-2h2V4H8v2z" fill="#fef08a"/>
  </svg>
);

// Frameless Floating 8-Bit Pixel Bell SVG (For Notifications)
const PixelBell = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 4h4v2h-4V4zm-2 2h2v2h-2V6zm6 0h2v2h-2V6zm-4 2h2v2h-2V8zm-4 0h2v2H10V8zm8 0h2v2h-2V8zm-2 2h2v12h-2V10zm-6 2h2v10H8V12zm14 0h2v10h-2V12zm-8 10h4v2h-4v-2zm-6 0h2v2H6v-2zm18 0h2v2h-2v-2zm-18 2h22v2H4v-2zm8 2h8v2h-8v-2zm2 2h4v2h-4v-2z" fill="#1A1A1A"/>
    <path d="M12 8h8v2h-8V8zm-2 2h12v2H10v-2zm-2 2h16v10H8V12zm-2 10h20v2H6v-2z" fill="#FFC72C"/>
    <path d="M20 12h2v10h-2V12zm-2 10h2v2h-2v-2z" fill="#E5A900"/>
    <path d="M11 14h2v4h-2v-4z" fill="#FFFFFF"/>
    <path d="M14 24h4v2h-4v-2zm1 2h2v2h-2v-2z" fill="#D49100"/>
  </svg>
);

// Unified 8-bit arcade navigation controls: notification bell + theme toggle.
// Drop-in replacement for the old ThemeToggle + NotificationBell inside the header.
export default function HeaderNavigation({ isDarkMode, toggleTheme }) {
  return (
    <div className="flex items-center gap-6">
      {/* NOTIFICATION BELL: Standalone floating icon with zero container layout borders or shadows */}
      <button
        onClick={() => console.log('Notifications clicked')}
        className="bg-transparent border-none p-0 m-0 cursor-pointer flex items-center justify-center transition-transform duration-70 active:scale-95 hover:scale-105"
        style={{ outline: 'none', boxShadow: 'none' }}
        aria-label="Notifications"
      >
        <PixelBell/>
      </button>

      {/* THEME TOGGLE: Tactile 3D Action Push Button changing color state dynamically */}
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
        {isDarkMode ? <PixelMoon/> : <PixelSun/>}
      </button>
    </div>
  );
}
