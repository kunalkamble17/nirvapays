import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white/90 text-slate-700 shadow-[0_5px_15px_-8px_rgba(15,23,42,0.8)] transition-all duration-300 hover:border-slate-300 hover:bg-white hover:shadow-lg dark:border-white/20 dark:bg-white/10 dark:text-slate-100 dark:hover:border-white/30 dark:hover:bg-white/20 dark:hover:shadow-[0_5px_15px_-8px_rgba(255,255,255,0.3)]"
      title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <Sun className="h-5 w-5 text-amber-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="h-5 w-5 text-slate-600 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  )
}
