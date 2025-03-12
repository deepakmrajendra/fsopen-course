import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import Todo from './Todo'

describe('Todo Component', () => {
  it('renders a todo item correctly', () => {
    const mockDelete = vi.fn()
    const mockComplete = vi.fn()

    const todo = { text: 'Learn Docker', done: false }

    render(<Todo todo={todo} deleteTodo={mockDelete} completeTodo={mockComplete} />)

    // Check that the text appears
    expect(screen.getByText('Learn Docker')).toBeInTheDocument()
    expect(screen.getByText('This todo is not done')).toBeInTheDocument()

    // Click "Set as done" and verify function call
    fireEvent.click(screen.getByText('Set as done'))
    expect(mockComplete).toHaveBeenCalledTimes(1)

    // Click "Delete" and verify function call
    fireEvent.click(screen.getByText('Delete'))
    expect(mockDelete).toHaveBeenCalledTimes(1)
  })

  it('renders a completed todo correctly', () => {
    const mockDelete = vi.fn()
    const todo = { text: 'Write Tests', done: true }

    render(<Todo todo={todo} deleteTodo={mockDelete} completeTodo={() => {}} />)

    expect(screen.getByText('Write Tests')).toBeInTheDocument()
    expect(screen.getByText('This todo is done')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Delete'))
    expect(mockDelete).toHaveBeenCalledTimes(1)
  })

})