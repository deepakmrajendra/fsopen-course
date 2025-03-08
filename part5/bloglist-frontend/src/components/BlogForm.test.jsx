import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from '../components/BlogForm'
import { vi } from 'vitest'

test('submitting the form calls createBlog with correct details', async () => {
  // Create a mock function to spy on form submission
  const createBlog = vi.fn()

  // Render BlogForm with the mocked function
  const { container } = render(<BlogForm createBlog={createBlog} />)
  const user = userEvent.setup()

  // Select inputs by their ID
  const titleInput = container.querySelector('#blog-title')
  const authorInput = container.querySelector('#blog-author')
  const urlInput = container.querySelector('#blog-url')

  // Select submit button using class name
  const submitButton = container.querySelector('.submit-button')

  // Simulate user typing in the form fields
  await user.type(titleInput, 'Test Blog Title')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'https://example.com')

  // Submit the form
  await user.click(submitButton)

  // Check if createBlog was called once
  expect(createBlog).toHaveBeenCalledTimes(1)

  // Check if createBlog was called with the correct values
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'https://example.com',
  })
})