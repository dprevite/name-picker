import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { ThemeProvider } from './contexts/ThemeContext'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock crypto.randomUUID
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
  },
})

// Mock matchMedia for theme tests
const mockMatchMedia = vi.fn()
Object.defineProperty(window, 'matchMedia', {
  value: mockMatchMedia,
})

function renderAppWithTheme() {
  return render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  )
}

describe('App Component', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
    localStorageMock.clear.mockClear()
    mockMatchMedia.mockClear()

    // Default mock for matchMedia
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })

    // Clear document classes
    document.documentElement.classList.remove('dark')

    // Mock clean URL (no search parameters) by default
    Object.defineProperty(window, 'location', {
      value: {
        search: '',
        pathname: '/',
      },
      writable: true,
    })

    // Mock history.replaceState
    Object.defineProperty(window, 'history', {
      value: { replaceState: vi.fn() },
      writable: true,
    })
  })

  it('renders the initial state', () => {
    localStorageMock.getItem.mockReturnValue(null)
    renderAppWithTheme()

    expect(screen.getByPlaceholderText('Enter a name')).toBeInTheDocument()
    expect(screen.getByText('No names added yet')).toBeInTheDocument()
  })

  it('loads names from localStorage on mount', () => {
    const savedNames = [
      { id: '1', name: 'John', color: 'bg-red-500', icon: '👤' },
      { id: '2', name: 'Jane', color: 'bg-blue-500', icon: '🧑' },
    ]
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedNames))

    renderAppWithTheme()

    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('Jane')).toBeInTheDocument()
    expect(screen.queryByText('No names added yet')).not.toBeInTheDocument()
  })

  it('adds a new name when typing and pressing Enter', async () => {
    localStorageMock.getItem.mockReturnValue(null)
    const user = userEvent.setup()
    renderAppWithTheme()

    const input = screen.getByPlaceholderText('Enter a name')
    await user.type(input, 'Alice')
    await user.keyboard('{Enter}')

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(input).toHaveValue('')
    expect(localStorageMock.setItem).toHaveBeenCalled()
  })

  it('adds a new name when clicking the plus button', async () => {
    localStorageMock.getItem.mockReturnValue(null)
    const user = userEvent.setup()
    renderAppWithTheme()

    const input = screen.getByPlaceholderText('Enter a name')
    const addButton = screen.getByRole('button', { name: /plus/i })

    await user.type(input, 'Bob')
    await user.click(addButton)

    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  it('does not add empty names', async () => {
    localStorageMock.getItem.mockReturnValue(null)
    const user = userEvent.setup()
    renderAppWithTheme()

    const input = screen.getByPlaceholderText('Enter a name')
    const addButton = screen.getByRole('button', { name: /plus/i })

    await user.type(input, '   ')
    await user.click(addButton)

    expect(screen.getByText('No names added yet')).toBeInTheDocument()
  })

  it('removes a name when clicking the trash button', async () => {
    const savedNames = [
      { id: '1', name: 'John', color: 'bg-red-500', icon: '👤' },
      { id: '2', name: 'Jane', color: 'bg-blue-500', icon: '🧑' },
    ]
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedNames))
    const user = userEvent.setup()
    renderAppWithTheme()

    expect(screen.getByText('John')).toBeInTheDocument()

    const trashButtons = screen.getAllByRole('button', { name: /trash/i })
    await user.click(trashButtons[0])

    expect(screen.queryByText('John')).not.toBeInTheDocument()
    expect(screen.getByText('Jane')).toBeInTheDocument()
  })

  it('shows disabled shuffle button when no names exist', () => {
    localStorageMock.getItem.mockReturnValue(null)
    renderAppWithTheme()

    const shuffleButton = screen.getByRole('button', { name: /shuffle/i })
    expect(shuffleButton).toBeDisabled()
    expect(screen.getByText('Add some names to get started')).toBeInTheDocument()
  })

  it('enables shuffle button when names exist', () => {
    const savedNames = [{ id: '1', name: 'John', color: 'bg-red-500', icon: '👤' }]
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedNames))
    renderAppWithTheme()

    const shuffleButton = screen.getByRole('button', { name: /shuffle/i })
    expect(shuffleButton).toBeEnabled()
  })

  it('shows shuffling animation when shuffle button is clicked', async () => {
    const savedNames = [
      { id: '1', name: 'John', color: 'bg-red-500', icon: '👤' },
      { id: '2', name: 'Jane', color: 'bg-blue-500', icon: '🧑' },
    ]
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedNames))
    const user = userEvent.setup()
    renderAppWithTheme()

    const shuffleButton = screen.getByRole('button', { name: /shuffle/i })
    await user.click(shuffleButton)

    expect(screen.getAllByText('Shuffling...')).toHaveLength(1)
    expect(screen.getByText('🎲')).toBeInTheDocument()
    expect(shuffleButton).toBeDisabled()
  })

  it('displays a selected name after shuffling completes', async () => {
    const savedNames = [{ id: '1', name: 'John', color: 'bg-red-500', icon: '👤' }]
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedNames))
    const user = userEvent.setup()
    renderAppWithTheme()

    const shuffleButton = screen.getByRole('button', { name: /shuffle/i })
    await user.click(shuffleButton)

    // Wait for shuffling animation to complete
    await waitFor(
      () => {
        expect(screen.queryByText('Shuffling...')).not.toBeInTheDocument()
      },
      { timeout: 3000 }
    )

    // Should show the selected name in the center display (large text)
    await waitFor(() => {
      const selectedNameElement = screen.getByText('John', {
        selector: 'p.font-bold',
      })
      expect(selectedNameElement).toBeInTheDocument()
    })
  })

  it('clears selected person when their name is removed', async () => {
    const savedNames = [{ id: '1', name: 'John', color: 'bg-red-500', icon: '👤' }]
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedNames))
    const user = userEvent.setup()
    renderAppWithTheme()

    // First shuffle to select John
    const shuffleButton = screen.getByRole('button', { name: /shuffle/i })
    await user.click(shuffleButton)

    await waitFor(
      () => {
        expect(screen.queryByText('Shuffling...')).not.toBeInTheDocument()
      },
      { timeout: 3000 }
    )

    // Now remove John
    const trashButton = screen.getByRole('button', { name: /trash/i })
    await user.click(trashButton)

    // Should clear the selected person display - verify default icon is shown
    expect(screen.getByText('👤')).toBeInTheDocument()
  })

  // Dark Mode Integration Tests
  it('renders theme toggle button', () => {
    localStorageMock.getItem.mockReturnValue(null)
    renderAppWithTheme()

    const themeToggle = screen.getByRole('button', { name: /switch to/i })
    expect(themeToggle).toBeInTheDocument()
  })

  it('allows toggling between light and dark themes', async () => {
    const user = userEvent.setup()
    localStorageMock.getItem.mockImplementation(key => {
      if (key === 'theme') return 'light'
      if (key === 'nameShuffle-people') return null
      return null
    })
    renderAppWithTheme()

    const themeToggle = screen.getByRole('button', { name: /switch to dark mode/i })
    expect(themeToggle).toBeInTheDocument()

    // Click to switch to dark mode
    await user.click(themeToggle)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark')

    // Should now show switch to light mode (wait for button to update)
    await waitFor(() => {
      const lightButton = screen.getByRole('button', { name: /switch to light mode/i })
      expect(lightButton).toBeInTheDocument()
    })
  })

  it('applies dark mode classes when theme is dark', () => {
    localStorageMock.getItem.mockImplementation(key => {
      if (key === 'theme') return 'dark'
      if (key === 'nameShuffle-people') return null
      return null
    })
    renderAppWithTheme()

    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('respects system preference when theme is system', () => {
    localStorageMock.getItem.mockImplementation(key => {
      if (key === 'theme') return 'system'
      if (key === 'nameShuffle-people') return null
      return null
    })
    mockMatchMedia.mockReturnValue({
      matches: true, // System prefers dark
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })

    renderAppWithTheme()

    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('loads names from URL parameters on mount', async () => {
    // Mock URL with names parameter
    Object.defineProperty(window, 'location', {
      value: {
        search: '?names=Alice,Bob,Charlie',
        pathname: '/',
      },
      writable: true,
    })

    localStorageMock.getItem.mockReturnValue(null)

    renderAppWithTheme()

    // Wait for names to load from URL
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('Bob')).toBeInTheDocument()
      expect(screen.getByText('Charlie')).toBeInTheDocument()
    })
  })

  it('updates URL when names are added', async () => {
    localStorageMock.getItem.mockReturnValue(null)

    renderAppWithTheme()
    const user = userEvent.setup()

    // Add a name
    const nameInput = screen.getByPlaceholderText('Enter a name')
    const addButton = screen.getByRole('button', { name: /plus/i })

    await user.type(nameInput, 'TestUser')
    await user.click(addButton)

    // Wait for URL to be updated
    await waitFor(() => {
      expect(window.history.replaceState).toHaveBeenCalledWith({}, '', '/?names=TestUser')
    })
  })
})
