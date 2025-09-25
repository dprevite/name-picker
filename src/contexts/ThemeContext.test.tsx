import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from './ThemeContext'
import { useTheme } from '../hooks/useTheme'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

function TestComponent() {
  const { theme, setTheme } = useTheme()
  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <button onClick={() => setTheme('light')}>Set Light</button>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
    </div>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()

    // Clear document classes
    document.documentElement.classList.remove('dark')
  })

  it('throws error when used outside provider', () => {
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useTheme must be used within a ThemeProvider')
  })

  it('initializes with dark theme by default', () => {
    localStorageMock.getItem.mockReturnValue(null)

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('loads saved theme from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('light')

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('sets theme to light and saves to localStorage', async () => {
    const user = userEvent.setup()
    localStorageMock.getItem.mockReturnValue(null)

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    await user.click(screen.getByText('Set Light'))

    expect(screen.getByTestId('theme')).toHaveTextContent('light')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('sets theme to dark and saves to localStorage', async () => {
    const user = userEvent.setup()
    localStorageMock.getItem.mockReturnValue('light')

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    await user.click(screen.getByText('Set Dark'))

    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('ignores invalid saved theme values', () => {
    localStorageMock.getItem.mockReturnValue('invalid-theme')

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    // Should fallback to default dark theme
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
