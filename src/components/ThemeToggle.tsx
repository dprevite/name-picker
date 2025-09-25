import { Sun, Moon } from 'lucide-react'
import { Button } from './ui/button'
import { useTheme } from '../hooks/useTheme'

export function ThemeToggle() {
  const { actualTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    // Simple toggle between light and dark based on current visual appearance
    const nextTheme = actualTheme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
  }

  const getIcon = () => {
    // Show icon based on what it will switch TO, not current state
    return actualTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
  }

  const getLabel = () => {
    // Show label based on what it will switch TO
    return actualTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={getLabel()}
      title="Toggle dark mode"
      className="text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer transition-all duration-150 hover:scale-105 active:scale-95 active:bg-accent/80 border border-border hover:border-primary shadow-sm hover:shadow-md"
    >
      {getIcon()}
    </Button>
  )
}
