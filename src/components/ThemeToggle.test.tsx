import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from './ThemeToggle'
import { ThemeProvider } from '../contexts/ThemeContext'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock matchMedia
const mockMatchMedia = vi.fn()
Object.defineProperty(window, 'matchMedia', {
  value: mockMatchMedia,
})

function renderThemeToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  )
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    mockMatchMedia.mockClear()

    // Clear document classes
    document.documentElement.classList.remove('dark')
  })

  it('renders theme toggle button', () => {
    localStorageMock.getItem.mockReturnValue(null)
    renderThemeToggle()

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    // Default is dark theme, so should show "Switch to light mode"
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode')
  })

  it('shows correct icon and label based on theme', () => {
    localStorageMock.getItem.mockReturnValue(null)
    renderThemeToggle()

    const button = screen.getByRole('button')
    // Default is dark theme, so should show "Switch to light mode"
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode')
    // Moon icon should be present when in dark mode
    expect(button.querySelector('svg')).toBeInTheDocument()
  })

  it('shows sun icon and correct label in light mode', () => {
    localStorageMock.getItem.mockReturnValue('light')
    renderThemeToggle()

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode')
    // Sun icon should be present in light mode
    expect(button.querySelector('svg')).toBeInTheDocument()
  })

  it('shows moon icon and correct label in dark mode', () => {
    localStorageMock.getItem.mockReturnValue('dark')
    renderThemeToggle()

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode')
    // Moon icon should be present in dark mode
    expect(button.querySelector('svg')).toBeInTheDocument()
  })

  it('toggles between light and dark themes when clicked', async () => {
    const user = userEvent.setup()
    localStorageMock.getItem.mockReturnValue('light')
    renderThemeToggle()

    const button = screen.getByRole('button')

    // Start in light mode
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode')

    // Click to go to dark mode
    await user.click(button)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark')

    // Click again to go back to light mode
    await user.click(button)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light')
  })

  it('applies correct CSS classes for styling', () => {
    localStorageMock.getItem.mockReturnValue('light')
    renderThemeToggle()

    const button = screen.getByRole('button')
    expect(button).toHaveClass('text-muted-foreground', 'hover:text-foreground')
  })

  it('has proper accessibility attributes', () => {
    localStorageMock.getItem.mockReturnValue('light')
    renderThemeToggle()

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label')
  })
})
