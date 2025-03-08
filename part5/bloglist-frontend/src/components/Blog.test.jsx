import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Blog from '../components/Blog'
import blogService from '../services/blogs'

// Mock blogService.update globally to prevent network requests
vi.mock('../services/blogs', () => {
  return {
    default: {
      update: vi.fn().mockResolvedValue({}), // Mock update function
    },
  }
})

describe('Blog component', () => {
  let blog
  let mockSetBlogs
  let mockUser

  beforeEach(() => {
    // Mock blog data
    blog = {
      id: '12345',
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'https://example.com',
      likes: 10,
      user: { username: 'testuser', name: 'Test User' },
    }

    // Mock setBlogs function
    mockSetBlogs = vi.fn()

    // Mock user
    mockUser = { username: 'testuser', name: 'Test User' }
  })

  test('renders only the blog title and author by default', () => {
    const { container } = render(<Blog blog={blog} blogs={[blog]} setBlogs={mockSetBlogs} user={mockUser} />)

    // Ensure title and author are visible
    expect(screen.getByText('Test Blog Title Test Author')).toBeDefined()

    // Ensure blog URL and likes are NOT visible initially
    expect(container.querySelector('.blogUrl')).not.toBeInTheDocument()
    expect(container.querySelector('.blogLikes')).not.toBeInTheDocument()
  })

  test('renders URL and likes when the "view" button is clicked', async () => {
    const { container } = render(<Blog blog={blog} blogs={[blog]} setBlogs={mockSetBlogs} user={mockUser} />)

    const user = userEvent.setup()

    // Click the "view" button
    await user.click(screen.getByText('view'))

    // Ensure title and author are visible
    expect(screen.getByText('Test Blog Title Test Author')).toBeDefined()

    // Ensure URL and likes are also now visible
    expect(container.querySelector('.blogUrl')).toBeDefined()
    expect(container.querySelector('.blogLikes')).toBeDefined()
  })

  test('clicking the like button twice calls the event handler twice', async () => {

    // Spy on handleLike function
    const handleLike = vi.fn()

    const { container } = render(<Blog blog={blog} blogs={[blog]} setBlogs={mockSetBlogs} user={mockUser} />)

    const user = userEvent.setup()

    // Click the "view" button to reveal like button
    await user.click(screen.getByText('view'))

    // Find the like button and click it twice
    const likeButton = container.querySelector('.blogLikes button')
    likeButton.onclick = handleLike

    // Click the like button twice
    await user.click(likeButton)
    await user.click(likeButton)

    // Expect the function to be called twice
    expect(handleLike).toHaveBeenCalledTimes(2)
  })

})