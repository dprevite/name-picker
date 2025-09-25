import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from './ThemeContext'

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

function TestComponent() {
  const { theme, actualTheme, setTheme } = useTheme()
  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <div data-testid="actual-theme">{actualTheme}</div>
      <button onClick={() => setTheme('light')}>Set Light</button>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('system')}>Set System</button>
    </div>
  )
}

describe('ThemeContext', () => {
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

  it('throws error when used outside provider', () => {
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useTheme must be used within a ThemeProvider')
  })

  it('initializes with system theme by default', () => {
    localStorageMock.getItem.mockReturnValue(null)

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('system')
    expect(screen.getByTestId('actual-theme')).toHaveTextContent('light')
  })

  it('loads saved theme from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('dark')

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(screen.getByTestId('actual-theme')).toHaveTextContent('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('detects system dark mode preference', () => {
    localStorageMock.getItem.mockReturnValue(null)
    mockMatchMedia.mockReturnValue({
      matches: true, // System prefers dark
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('system')
    expect(screen.getByTestId('actual-theme')).toHaveTextContent('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
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
    expect(screen.getByTestId('actual-theme')).toHaveTextContent('light')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('sets theme to dark and saves to localStorage', async () => {
    const user = userEvent.setup()
    localStorageMock.getItem.mockReturnValue(null)

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    await user.click(screen.getByText('Set Dark'))

    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(screen.getByTestId('actual-theme')).toHaveTextContent('dark')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('responds to system theme changes when in system mode', async () => {
    const mockEventListener = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    mockMatchMedia.mockReturnValue(mockEventListener)

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    // Initially in system mode with light preference
    expect(screen.getByTestId('actual-theme')).toHaveTextContent('light')

    // Simulate system theme change to dark
    act(() => {
      mockEventListener.matches = true
      const changeHandler = mockEventListener.addEventListener.mock.calls.find(
        call => call[0] === 'change'
      )?.[1]
      if (changeHandler) {
        changeHandler()
      }
    })

    expect(screen.getByTestId('actual-theme')).toHaveTextContent('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('ignores invalid saved theme values', () => {
    localStorageMock.getItem.mockReturnValue('invalid-theme')

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('system')
  })
})