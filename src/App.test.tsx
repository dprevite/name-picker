import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

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

describe('App Component', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
    localStorageMock.clear.mockClear()
  })

  it('renders the main title and initial state', () => {
    localStorageMock.getItem.mockReturnValue(null)
    render(<App />)
    
    expect(screen.getByText('Name Shuffle')).toBeInTheDocument()
    expect(screen.getByText('Names')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter a name')).toBeInTheDocument()
    expect(screen.getByText('No names added yet')).toBeInTheDocument()
    expect(screen.getByText('Press shuffle to pick a name!')).toBeInTheDocument()
  })

  it('loads names from localStorage on mount', () => {
    const savedNames = [
      { id: '1', name: 'John', color: 'bg-red-500', icon: '👤' },
      { id: '2', name: 'Jane', color: 'bg-blue-500', icon: '🧑' },
    ]
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedNames))
    
    render(<App />)
    
    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('Jane')).toBeInTheDocument()
    expect(screen.queryByText('No names added yet')).not.toBeInTheDocument()
  })

  it('adds a new name when typing and pressing Enter', async () => {
    localStorageMock.getItem.mockReturnValue(null)
    const user = userEvent.setup()
    render(<App />)
    
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
    render(<App />)
    
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
    render(<App />)
    
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
    render(<App />)
    
    expect(screen.getByText('John')).toBeInTheDocument()
    
    const trashButtons = screen.getAllByRole('button', { name: /trash/i })
    await user.click(trashButtons[0])
    
    expect(screen.queryByText('John')).not.toBeInTheDocument()
    expect(screen.getByText('Jane')).toBeInTheDocument()
  })

  it('shows disabled shuffle button when no names exist', () => {
    localStorageMock.getItem.mockReturnValue(null)
    render(<App />)
    
    const shuffleButton = screen.getByRole('button', { name: /shuffle/i })
    expect(shuffleButton).toBeDisabled()
    expect(screen.getByText('Add some names to get started')).toBeInTheDocument()
  })

  it('enables shuffle button when names exist', () => {
    const savedNames = [
      { id: '1', name: 'John', color: 'bg-red-500', icon: '👤' },
    ]
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedNames))
    render(<App />)
    
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
    render(<App />)
    
    const shuffleButton = screen.getByRole('button', { name: /shuffle/i })
    await user.click(shuffleButton)
    
    expect(screen.getAllByText('Shuffling...')).toHaveLength(2)
    expect(screen.getByText('🎲')).toBeInTheDocument()
    expect(shuffleButton).toBeDisabled()
  })

  it('displays a selected name after shuffling completes', async () => {
    const savedNames = [
      { id: '1', name: 'John', color: 'bg-red-500', icon: '👤' },
    ]
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedNames))
    const user = userEvent.setup()
    render(<App />)
    
    const shuffleButton = screen.getByRole('button', { name: /shuffle/i })
    await user.click(shuffleButton)
    
    // Wait for shuffling animation to complete
    await waitFor(() => {
      expect(screen.queryByText('Shuffling...')).not.toBeInTheDocument()
    }, { timeout: 3000 })
    
    // Should show the selected name
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument()
    })
  })

  it('clears selected person when their name is removed', async () => {
    const savedNames = [
      { id: '1', name: 'John', color: 'bg-red-500', icon: '👤' },
    ]
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedNames))
    const user = userEvent.setup()
    render(<App />)
    
    // First shuffle to select John
    const shuffleButton = screen.getByRole('button', { name: /shuffle/i })
    await user.click(shuffleButton)
    
    await waitFor(() => {
      expect(screen.queryByText('Shuffling...')).not.toBeInTheDocument()
    }, { timeout: 3000 })
    
    // Now remove John
    const trashButton = screen.getByRole('button', { name: /trash/i })
    await user.click(trashButton)
    
    // Should clear the selected person display
    expect(screen.getByText('Press shuffle to pick a name!')).toBeInTheDocument()
  })
})