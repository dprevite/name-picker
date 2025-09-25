import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './input'

describe('Input Component', () => {
  it('renders correctly with placeholder', () => {
    render(<Input placeholder="Enter text here" />)
    
    const input = screen.getByPlaceholderText('Enter text here')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('flex', 'h-10', 'w-full', 'rounded-md')
  })

  it('applies default styling classes', () => {
    render(<Input data-testid="test-input" />)
    
    const input = screen.getByTestId('test-input')
    expect(input).toHaveClass(
      'border',
      'border-input',
      'bg-background',
      'px-3',
      'py-2',
      'text-sm'
    )
  })

  it('handles text input correctly', async () => {
    const user = userEvent.setup()
    render(<Input placeholder="Type here" />)
    
    const input = screen.getByPlaceholderText('Type here')
    await user.type(input, 'Hello World')
    
    expect(input).toHaveValue('Hello World')
  })

  it('calls onChange handler when text changes', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()
    render(<Input onChange={handleChange} placeholder="Change test" />)
    
    const input = screen.getByPlaceholderText('Change test')
    await user.type(input, 'a')
    
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('supports different input types', () => {
    const { rerender } = render(<Input type="password" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'password')

    rerender(<Input type="email" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'email')

    rerender(<Input type="number" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'number')
  })

  it('can be disabled', () => {
    render(<Input disabled placeholder="Disabled input" />)
    
    const input = screen.getByPlaceholderText('Disabled input')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
  })

  it('does not accept input when disabled', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()
    render(<Input disabled onChange={handleChange} placeholder="Disabled" />)
    
    const input = screen.getByPlaceholderText('Disabled')
    await user.type(input, 'test')
    
    expect(input).toHaveValue('')
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(<Input className="custom-input-class" data-testid="custom" />)
    
    const input = screen.getByTestId('custom')
    expect(input).toHaveClass('custom-input-class')
  })

  it('forwards ref correctly', () => {
    let ref: HTMLInputElement | null = null
    render(<Input ref={(el) => { ref = el }} />)
    
    expect(ref).toBeInstanceOf(HTMLInputElement)
  })

  it('handles focus and blur events', async () => {
    const handleFocus = vi.fn()
    const handleBlur = vi.fn()
    const user = userEvent.setup()
    
    render(<Input onFocus={handleFocus} onBlur={handleBlur} placeholder="Focus test" />)
    
    const input = screen.getByPlaceholderText('Focus test')
    
    await user.click(input)
    expect(handleFocus).toHaveBeenCalledTimes(1)
    
    await user.tab()
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('handles keyboard events', async () => {
    const handleKeyDown = vi.fn()
    const handleKeyPress = vi.fn()
    const handleKeyUp = vi.fn()
    const user = userEvent.setup()
    
    render(
      <Input
        onKeyDown={handleKeyDown}
        onKeyPress={handleKeyPress}
        onKeyUp={handleKeyUp}
        placeholder="Key events"
      />
    )
    
    const input = screen.getByPlaceholderText('Key events')
    await user.type(input, 'a')
    
    expect(handleKeyDown).toHaveBeenCalled()
    expect(handleKeyUp).toHaveBeenCalled()
  })

  it('supports controlled input pattern', async () => {
    const user = userEvent.setup()
    const TestComponent = () => {
      const [value, setValue] = React.useState('')
      return (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Controlled"
        />
      )
    }
    
    render(<TestComponent />)
    
    const input = screen.getByPlaceholderText('Controlled')
    await user.type(input, 'controlled text')
    
    expect(input).toHaveValue('controlled text')
  })

  it('supports all standard input attributes', () => {
    render(
      <Input
        name="test-input"
        id="test-id"
        required
        maxLength={10}
        minLength={2}
        autoComplete="off"
        autoFocus
        data-testid="full-attrs"
      />
    )
    
    const input = screen.getByTestId('full-attrs')
    expect(input).toHaveAttribute('name', 'test-input')
    expect(input).toHaveAttribute('id', 'test-id')
    expect(input).toHaveAttribute('required')
    expect(input).toHaveAttribute('maxlength', '10')
    expect(input).toHaveAttribute('minlength', '2')
    expect(input).toHaveAttribute('autocomplete', 'off')
    expect(input).toHaveFocus()
  })

  it('shows focus ring styles when focused', async () => {
    const user = userEvent.setup()
    render(<Input placeholder="Focus ring test" />)
    
    const input = screen.getByPlaceholderText('Focus ring test')
    expect(input).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2')

    await user.click(input)
    expect(input).toHaveFocus()
  })
})