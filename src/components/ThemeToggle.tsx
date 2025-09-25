import { Sun, Moon, Monitor } from 'lucide-react'
import { Button } from './ui/button'
import { useTheme } from '../hooks/useTheme'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    // Cycle through: system -> light -> dark -> system
    switch (theme) {
      case 'system':
        setTheme('light')
        break
      case 'light':
        setTheme('dark')
        break
      case 'dark':
        setTheme('system')
        break
      default:
        setTheme('system')
    }
  }

  const getIcon = () => {
    // Show icon based on current theme, not what it will switch to
    switch (theme) {
      case 'system':
        return <Monitor className="h-4 w-4" />
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const getLabel = () => {
    // Show label based on what it will switch TO
    switch (theme) {
      case 'system':
        return 'Switch to light mode'
      case 'light':
        return 'Switch to dark mode'
      case 'dark':
        return 'Switch to system mode'
      default:
        return 'Switch to light mode'
    }
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
