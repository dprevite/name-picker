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

    // Default mock for matchMedia
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })

    // Clear document classes
    document.documentElement.classList.remove('dark')
  })

  it('renders theme toggle button', () => {
    localStorageMock.getItem.mockReturnValue(null)
    renderThemeToggle()

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode')
  })

  it('shows monitor icon and correct label in system mode', () => {
    localStorageMock.getItem.mockReturnValue('system')
    renderThemeToggle()

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode')
    // Monitor icon should be present (lucide-react monitor icon)
    expect(button.querySelector('svg')).toBeInTheDocument()
  })

  it('shows sun icon and correct label in light mode', () => {
    localStorageMock.getItem.mockReturnValue('light')
    renderThemeToggle()

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode')
    // Sun icon should be present (lucide-react sun icon)
    expect(button.querySelector('svg')).toBeInTheDocument()
  })

  it('shows moon icon and correct label in dark mode', () => {
    localStorageMock.getItem.mockReturnValue('dark')
    renderThemeToggle()

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Switch to system mode')
    // Moon icon should be present (lucide-react moon icon)
    expect(button.querySelector('svg')).toBeInTheDocument()
  })

  it('cycles through themes when clicked', async () => {
    const user = userEvent.setup()
    localStorageMock.getItem.mockReturnValue('light')
    renderThemeToggle()

    const button = screen.getByRole('button')

    // Start in light mode
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode')

    // Click to go to dark mode
    await user.click(button)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark')

    // Click to go to system mode
    await user.click(button)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'system')

    // Click to go to light mode
    await user.click(button)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light')
  })

  it('applies correct CSS classes for styling', () => {
    localStorageMock.getItem.mockReturnValue('light')
    renderThemeToggle()

    const button = screen.getByRole('button')
    expect(button).toHaveClass('text-gray-600', 'hover:text-gray-900')
    expect(button).toHaveClass('dark:text-gray-400', 'dark:hover:text-gray-100')
  })

  it('has proper accessibility attributes', () => {
    localStorageMock.getItem.mockReturnValue('light')
    renderThemeToggle()

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label')
  })
})