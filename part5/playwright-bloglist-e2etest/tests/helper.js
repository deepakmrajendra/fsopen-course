import { expect } from '@playwright/test'

const loginWith = async (page, username, password)  => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  // Wait for the blog form to be visible
  await expect(page.locator('#blog-title')).toBeVisible()
  // Fill in blog details
  await page.fill('#blog-title', title)
  await page.fill('#blog-author', author)
  await page.fill('#blog-url', url)
  // Submit the blog form
  await page.click('.submit-button')
  // await page.getByText(`${title} ${author}`).waitFor()
}

export { loginWith, createBlog }