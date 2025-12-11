'use client'

import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui'
import { useTheme } from '@/contexts/ThemeContext'

export function ThemeToggle({ className = '' }) {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      <Button
        onClick={toggleTheme}
        variant="outline"
        size="sm"
        className={`flex items-center space-x-2 transition-all duration-300 ${
          isDarkMode 
            ? 'border-gray-600 text-orange-400 hover:bg-gray-700 hover:border-orange-400' 
            : 'border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300'
        }`}
      >
        <motion.div
          animate={{ rotate: isDarkMode ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </motion.div>
        <span className="font-medium">
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </span>
      </Button>
    </motion.div>
  )
}

export default ThemeToggle