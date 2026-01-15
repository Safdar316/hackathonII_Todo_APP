'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

/**
 * Animated theme toggle button with sun/moon icons.
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg shadow-gray-200/50 dark:shadow-slate-900/50 border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:scale-105 transition-all duration-300"
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: -20, rotate: -180 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <AnimatePresence mode="wait">
        {theme === 'light' ? (
          // Sun icon - click to go dark
          <motion.svg
            key="sun"
            className="w-6 h-6 text-amber-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            initial={{ scale: 0, rotate: -90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 90, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </motion.svg>
        ) : (
          // Moon icon - click to go light
          <motion.svg
            key="moon"
            className="w-6 h-6 text-indigo-400"
            fill="currentColor"
            viewBox="0 0 24 24"
            initial={{ scale: 0, rotate: 90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
