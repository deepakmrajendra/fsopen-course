const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})


describe('when there are some blogs saved initially', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('unique identifier property of blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body

    blogs.forEach(blog => {
      assert(blog.id, 'Blog object does not have id property')
      assert(!blog._id, 'Blog object should not have _id property')
    })
  })

})

describe('addition of a new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Understanding Async/Await in JavaScript',
      author: 'Jane Doe',
      url: 'https://janedoe.dev/async-await',
      likes: 15,
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    const titles = blogsAtEnd.map(blog => blog.title)
    assert(titles.includes('Understanding Async/Await in JavaScript'))
  })

  test('if likes property is missing, it defaults to 0', async () => {
    const newBlog = {
      title: 'Understanding JavaScript Closures',
      author: 'Jane Doe',
      url: 'http://example.com/js-closures'
      // 'likes' property is intentionally omitted
    }
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    // Verify that the 'likes' property defaults to 0
    assert.strictEqual(response.body.likes, 0)
    // Optionally, verify that the new blog is saved in the database
    const blogsAtEnd = await helper.blogsInDb()
    const savedBlog = blogsAtEnd.find(blog => blog.id === response.body.id)
    assert(savedBlog)
    assert.strictEqual(savedBlog.likes, 0)
  })

  test('fails with status 400 if title is missing', async () => {
    const newBlog = {
      author: 'Author Name',
      url: 'http://example.com',
      likes: 5,
    }
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'Title and URL are required')
  })

  test('fails with status 400 if url is missing', async () => {
    const newBlog = {
      title: 'Sample Title',
      author: 'Author Name',
      likes: 5,
    }
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.error, 'Title and URL are required')
  })
})

describe('deletion of a blog post', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
    const titles = blogsAtEnd.map(blog => blog.title)
    assert(!titles.includes(blogToDelete.title))
  })

  test('fails with status code 404 if blog does not exist', async () => {
    const nonExistingId = await helper.nonExistingId()
    await api
      .delete(`/api/blogs/${nonExistingId}`)
      .expect(404)
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('fails with status code 400 if id is invalid', async () => {
    const invalidId = '12345invalidid'
    await api
      .delete(`/api/blogs/${invalidId}`)
      .expect(400)
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

})


describe('updating a blog post', () => {
  test('succeeds with status code 200 and updates the blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const updatedBlogData = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 5 // Increment likes
    }
    const result = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(result.body.likes, updatedBlogData.likes)
    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    assert.strictEqual(updatedBlog.likes, updatedBlogData.likes)
  })

  test('fails with status code 404 if blog does not exist', async () => {
    const nonExistingId = await helper.nonExistingId()
    const updatedBlogData = {
      title: 'Non-existent Blog',
      author: 'Unknown Author',
      url: 'http://nonexistent.url',
      likes: 10
    }
    await api
      .put(`/api/blogs/${nonExistingId}`)
      .send(updatedBlogData)
      .expect(404)
  })

  test('fails with status code 400 if invalid ID is provided', async () => {
    const invalidId = '12345invalidid'
    await api
      .put(`/api/blogs/${invalidId}`)
      .send({ likes: 10 })
      .expect(400)
  })
})


after(async () => {
  await mongoose.connection.close()
})