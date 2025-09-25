import { Sun, Moon } from 'lucide-react'
import { Button } from './ui/button'
import { useTheme } from '../hooks/useTheme'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    // Simple toggle between light and dark
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const getIcon = () => {
    // Show icon for current theme
    return theme === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
  }

  const getLabel = () => {
    // Show label for what it will switch TO
    return theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
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
