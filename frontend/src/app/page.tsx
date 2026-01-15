'use client';

import { motion } from 'framer-motion';
import TodoList from '@/components/TodoList';

/**
 * Main page with animated hero section and todo application.
 */
export default function Home() {
  return (
    <div className="min-h-screen py-8 transition-colors duration-300">
      {/* Hero Section */}
      <motion.header
        className="relative text-center py-12 sm:py-16 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated gradient background blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Top-right blob - brighter in dark mode */}
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-400/30 to-accent-400/30 dark:from-primary-500/40 dark:to-accent-500/40 rounded-full blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          {/* Bottom-left blob */}
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent-400/20 to-primary-400/20 dark:from-accent-500/30 dark:to-primary-500/30 rounded-full blur-3xl"
            animate={{
              x: [0, -20, 0],
              y: [0, 30, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          {/* Center subtle glow for dark mode */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary-500/0 to-accent-500/0 dark:from-primary-500/10 dark:to-accent-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Animated checkmark icon */}
        <motion.div
          className="mx-auto mb-6 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 dark:from-primary-400 dark:to-accent-400 flex items-center justify-center shadow-lg shadow-primary-500/25 dark:shadow-primary-500/40"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2
          }}
        >
          <motion.svg
            className="w-10 h-10 sm:w-12 sm:h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />
          </motion.svg>
        </motion.div>

        {/* Animated title */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <span className="bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600 dark:from-primary-400 dark:via-accent-400 dark:to-primary-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            Todo App
          </span>
        </motion.h1>

        {/* Animated subtitle */}
        <motion.p
          className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-8 transition-colors duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Stay organized and boost your productivity with our beautiful task manager
        </motion.p>

        {/* Animated feature pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {[
            { name: 'Fast & Smooth', icon: '⚡' },
            { name: 'Cloud Sync', icon: '☁️' },
            { name: 'Dark Mode', icon: '🌙' }
          ].map((feature, index) => (
            <motion.span
              key={feature.name}
              className="px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-600 shadow-sm hover:shadow-md dark:shadow-slate-900/50 transition-all duration-300"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <span className="mr-1.5">{feature.icon}</span>
              {feature.name}
            </motion.span>
          ))}
        </motion.div>
      </motion.header>

      {/* Divider */}
      <motion.div
        className="w-24 h-1 mx-auto mb-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 dark:from-primary-400 dark:to-accent-400"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      />

      {/* Todo List Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <TodoList />
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="text-center py-8 mt-12 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <p>Built with Next.js, Tailwind CSS & Framer Motion</p>
      </motion.footer>
    </div>
  );
}
