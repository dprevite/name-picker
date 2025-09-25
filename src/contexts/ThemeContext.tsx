import React, { useEffect, useState } from 'react'
import { ThemeContext } from './theme-context'

type Theme = 'light' | 'dark'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    // Load saved theme preference, default to dark if none exists
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    // Apply theme to document root
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
