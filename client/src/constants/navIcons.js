// Central map of retro pixel-art SVG assets used across the app chrome
// (Sidebar nav + Navbar header controls). Vite resolves each import to a
// hashed, bundled URL string, so these can be dropped straight into <img src>.
import dashboardIcon from '../assets/icons/dashboard.svg'
import folderIcon from '../assets/icons/folder.svg'
import taskIcon from '../assets/icons/task.svg'
import analyticsIcon from '../assets/icons/analytics.svg'
import calendarIcon from '../assets/icons/calendar.svg'
import settingsIcon from '../assets/icons/settings.svg'
import lightIcon from '../assets/icons/light.svg'
import darkIcon from '../assets/icons/dark.svg'
import bellIcon from '../assets/icons/bellicon.svg'
import logoIcon from '../assets/icons/logo.svg'

export const navIcons = {
  dashboard: dashboardIcon,
  folder: folderIcon,
  task: taskIcon,
  analytics: analyticsIcon,
  calendar: calendarIcon,
  settings: settingsIcon,
  light: lightIcon,
  dark: darkIcon,
  bell: bellIcon,
  logo: logoIcon,
}

export default navIcons
