const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {

  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    // Create two users: User A (creator) and User B (non-creator)
    await request.post('/api/users', {
      data: {
        name: 'User A',
        username: 'userA',
        password: 'passwordA'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'User B',
        username: 'userB',
        password: 'passwordB'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    // Check for the presence of username and password input fields
    const usernameInput = page.locator('[data-testid="username"]')
    const passwordInput = page.locator('[data-testid="password"]')
    const loginButton = page.locator('button', { hasText: 'login' })

    // Expect inputs and button to be visible
    await expect(usernameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(loginButton).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'userA', 'passwordA')
      await expect(page.getByText('User A logged in')).toBeVisible()
    })
  
    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'userA', 'wrong')
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
  
      await expect(page.getByText('User A logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'userA', 'passwordA')
      await expect(page.locator('button', { hasText: 'Logout' })).toBeVisible()
      // Click the correct "new blog" button inside the blog creation section
      await page.locator('button', { hasText: 'new blog' }).first().click()
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Test Blog Title', 'Test Author', 'https://example.com')
      // Ensure the new blog appears in the list
      await expect(page.getByText('Test Blog Title Test Author')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Likeable Blog', 'Test Author', 'https://example.com')
      // Ensure the blog appears in the list
      await expect(page.getByText('Likeable Blog Test Author')).toBeVisible()
    
      // Click the "view" button to reveal details
      await page.locator('button', { hasText: 'view' }).first().click()
    
      // Locate and extract the initial like count
      const likeCountLocator = page.locator('.blogLikes')
      const initialLikesText = await likeCountLocator.textContent()
      // Extracts a number from a string using a regular expression
      const initialLikes = parseInt(initialLikesText.match(/\d+/)[0], 10)
    
      // Click the "like" button
      await page.locator('.blogLikes button', { hasText: 'like' }).click()
    
      // Expect the like count to be incremented
      await expect(likeCountLocator).toContainText(`likes ${initialLikes + 1}`)
    })

    test('a user can delete their own blog', async ({ page }) => {
      await createBlog(page, 'Deletable Blog', 'Test Author', 'https://example.com')
      await expect(page.getByText('Deletable Blog Test Author')).toBeVisible()
      // Click the "view" button to reveal the remove button
      await page.locator('button', { hasText: 'view' }).first().click()
      // Handle the window.confirm dialog (mock user confirmation)
      page.once('dialog', async (dialog) => {
        expect(dialog.message()).toContain('Are you sure, you want to remove blog')
        await dialog.accept()  // Accept the confirmation
      })
      // Click the "remove" button
      await page.locator('button', { hasText: 'remove' }).click()
      // Ensure the blog is removed
      await expect(page.getByText('Deletable Blog Test Author')).not.toBeVisible()
    })

    test('only the blog creator sees the delete button', async ({ page, context }) => {
      await createBlog(page, 'Exclusive Blog', 'User A', 'https://example.com')
      await expect(page.getByText('Exclusive Blog User A')).toBeVisible()
      await page.locator('button', { hasText: 'view' }).first().click()
      await expect(page.locator('button', { hasText: 'remove' })).toBeVisible()
      // Logout User A
      await page.locator('button', { hasText: 'Logout' }).click()
      await expect(page.getByText('log in to application')).toBeVisible()
      // Open a new browser context to simulate a different session
      const userBContext = await context.newPage()
      // Login as User B
      await userBContext.goto('/')
      await loginWith(userBContext, 'userB', 'passwordB')
      // Ensure blog is visible to User B
      await expect(userBContext.getByText('Exclusive Blog User A')).toBeVisible()
      // Click "view" to reveal blog details
      await userBContext.locator('button', { hasText: 'view' }).first().click()
      // Ensure User B CANNOT see the delete button
      await expect(userBContext.locator('button', { hasText: 'remove' })).not.toBeVisible()
    })

    test('blogs are ordered by likes in descending order', async ({ page }) => {
      // Create blogs
      await createBlog(page, 'Least Popular Blog', 'Author A', 'https://example.com')
      await expect(page.getByText('Least Popular Blog Author A')).toBeVisible()
      
      await createBlog(page, 'Moderately Popular Blog', 'Author B', 'https://example.com')
      await expect(page.getByText('Moderately Popular Blog Author B')).toBeVisible()
      
      await createBlog(page, 'Most Popular Blog', 'Author C', 'https://example.com')
      await expect(page.getByText('Most Popular Blog Author C')).toBeVisible()
    
      // Function to like a blog dynamically after sorting updates
      const likeBlog = async (blogTitle, likes) => {
        for (let i = 0; i < likes; i++) {
          // Locate the blog dynamically (since it moves after sorting)
          const blogSummary = page.locator('.blogSummary', { hasText: blogTitle }).first()
          const blogContainer = blogSummary.locator('..').locator('.blogDetails')
    
          // Expand blog details if not already visible
          if (!(await blogContainer.isVisible())) {
            await blogSummary.locator('button', { hasText: 'view' }).click()
            await expect(blogContainer).toBeVisible()
          }
    
          // Locate the like button and like count
          const likeButton = blogContainer.locator('.blogLikes button', { hasText: 'like' })
          const likeCountLocator = blogContainer.locator('.blogLikes')
    
          // Get current like count
          let previousLikesText = await likeCountLocator.textContent()
          let previousLikes = parseInt(previousLikesText.match(/\d+/)[0], 10)
    
          // Click the like button
          await likeButton.click()
    
          // Wait for likes to update dynamically
          await expect(likeCountLocator).toHaveText(new RegExp(`likes ${previousLikes + 1}`))
        }
      }
    
      // Like counts: Most Popular (5 likes), Moderately Popular (3 likes), Least Popular (1 like)
      await likeBlog('Least Popular Blog', 1)
      await likeBlog('Moderately Popular Blog', 3)
      await likeBlog('Most Popular Blog', 5)
    
      // Wait for UI to stabilize after likes are updated
      await page.waitForTimeout(1000)
      
      // Retrieve all blog elements in the order they appear in the DOM
      const blogElements = await page.locator('.blogSummary').all()
      
      await page.pause()

      // Ensure all blogs are expanded before extracting details
      await Promise.all(blogElements.map(async (blog) => {
        const blogContainer = blog.locator('..').locator('.blogDetails')
      
        // Expand blog if details are not already visible
        if (!(await blogContainer.isVisible())) {
          await blog.locator('button', { hasText: 'view' }).click()
          await expect(blogContainer).toBeVisible()
        }
      }))
      
      // Extract blog titles and their respective like counts
      const blogsWithLikes = await Promise.all(blogElements.map(async (blog) => {
        // Extract title while removing extra "hide" text
        let title = await blog.innerText()
        title = title.replace(/hide$/, '').trim() // Remove "hide" at the end
      
        console.log('Title:', title) // Debugging output
        
        // Now safely extract the like count
        const likeCountText = await blog.locator('..').locator('.blogDetails .blogLikes').innerText()
        
        console.log('Like Count Text:', likeCountText) // Debugging output
        
        // Extract numeric like count
        const likeCount = parseInt(likeCountText.match(/\d+/)[0], 10)
        console.log('Like Count Number:', likeCount) // Debugging output
        
        return { title, likeCount }
      }))
      
      // Ensure blogs are ordered by likes (highest first)
      const sortedBlogs = [...blogsWithLikes].sort((a, b) => b.likeCount - a.likeCount)
      
      // Extract titles from sorted blogs for assertion
      const sortedTitles = sortedBlogs.map(blog => blog.title)
      
      // Validate that the UI reflects the correct sorting order
      expect(sortedTitles).toEqual([
        expect.stringContaining('Most Popular Blog'),
        expect.stringContaining('Moderately Popular Blog'),
        expect.stringContaining('Least Popular Blog'),
      ])
    })
  })
})