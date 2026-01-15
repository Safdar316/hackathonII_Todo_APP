'use client';

import { motion } from 'framer-motion';

/**
 * Animated loading spinner component.
 */
export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* Animated spinner */}
      <motion.div
        className="relative w-16 h-16"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-primary-200 dark:border-primary-900"
        />
        {/* Spinning arc */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        {/* Inner pulse */}
        <motion.div
          className="absolute inset-2 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Loading text */}
      <motion.p
        className="mt-4 text-sm text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Loading your tasks...
      </motion.p>
    </div>
  );
}
