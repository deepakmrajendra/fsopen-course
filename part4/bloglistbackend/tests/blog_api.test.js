const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const api = supertest(app)

// beforeEach(async () => {
//   await Blog.deleteMany({})
//   await Blog.insertMany(helper.initialBlogs)
// })

describe('run all the automated tests', () => {

  let userId

  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    // Create initial user
    const user = await helper.initialUsers()
    const savedUser = await user.save()
    userId = savedUser._id.toString() // Store userId for later use
    // Create initial blogs linked to the user
    const blogsWithUser = helper.initialBlogs.map(blog => ({
      ...blog,
      user: userId,
    }))
    const savedBlogs = await Blog.insertMany(blogsWithUser)
    // Update user with valid blog references
    savedUser.blogs = savedBlogs.map(blog => blog._id)
    await savedUser.save()
  })

  describe('when there is initially one user in db', () => {

    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('expected `username` to be unique'))
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('fails with status code 400 if username or password is missing', async () => {
      const usersAtStart = await helper.usersInDb()
      const noUsername = {
        name: 'No Username',
        password: 'validpass'
      }
      const noPassword = {
        username: 'nousername',
        name: 'No Password'
      }
      // Missing username
      let result = await api
        .post('/api/users')
        .send(noUsername)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      assert(result.body.error.includes('Username and password are required'))
      // Missing password
      result = await api
        .post('/api/users')
        .send(noPassword)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      assert(result.body.error.includes('Username and password are required'))
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('fails with status code 400 if username is too short', async () => {
      const usersAtStart = await helper.usersInDb()
      const shortUsername = {
        username: 'ab',
        name: 'Short Username',
        password: 'validpass'
      }
      const result = await api
        .post('/api/users')
        .send(shortUsername)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      assert(result.body.error.includes('Username must be at least 3 characters long'))
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('fails with status code 400 if password is too short', async () => {
      const usersAtStart = await helper.usersInDb()
      const shortPassword = {
        username: 'validuser',
        name: 'Short Password',
        password: 'ab'
      }
      const result = await api
        .post('/api/users')
        .send(shortPassword)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      assert(result.body.error.includes('Password must be at least 3 characters long'))
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

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
    let token
    beforeEach(async () => {
      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
        .expect(200)
      token = loginResponse.body.token
    })

    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'Understanding Async/Await in JavaScript',
        author: 'Jane Doe',
        url: 'https://janedoe.dev/async-await',
        likes: 15
      }
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
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
        url: 'http://example.com/js-closures',
        // 'likes' property is intentionally omitted
      }
      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
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
        likes: 5
      }
      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.error, 'Title and URL are required')
    })

    test('fails with status 400 if url is missing', async () => {
      const newBlog = {
        title: 'Sample Title',
        author: 'Author Name',
        likes: 5
      }
      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      assert.strictEqual(response.body.error, 'Title and URL are required')
    })

    test('fails with status code 401 if token is missing', async () => {
      const newBlog = {
        title: 'Understanding Async/Await in JavaScript',
        author: 'Jane Doe',
        url: 'https://janedoe.dev/async-await',
        likes: 15
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status code 401 if token is invalid', async () => {
      const newBlog = {
        title: 'Invalid token should not allow creation',
        author: 'Invalid Author',
        url: 'https://invalidurl.com/',
        likes: 15
      }
      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer invalidtoken123')
        .send(newBlog)
        .expect(401)
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status code 401 if token is expired', async () => {
      // Create an expired token manually
      const user = await User.findOne({ username: 'root' })
      if (!user) throw new Error('Test setup failed: user not found')
      const expiredToken = jwt.sign(
        { username: user.username, id: user._id.toString() },
        process.env.SECRET,
        { expiresIn: -10 } // Set expiration in the past
      )
      const newBlog = {
        title: 'Expired token should not allow creation',
        author: 'Expired Author',
        url: 'https://expiredurl.com/',
        likes: 15
      }
      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${expiredToken}`)
        .send(newBlog)
        .expect(401)
      assert.strictEqual(response.body.error, 'token expired')
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

  })


  describe('deletion of a blog post', () => {
    let token
    let user

    beforeEach(async () => {
      await User.deleteMany({})
      await Blog.deleteMany({})
      // Create a user and obtain token
      const newUser = { username: 'testuser', password: 'testpass' }
      const userResponse = await api.post('/api/users').send(newUser)
      user = userResponse.body
      const loginResponse = await api.post('/api/login').send(newUser)
      token = loginResponse.body.token
      // Create a blog linked to the user
      const newBlog = {
        title: 'Blog to delete',
        author: 'Test Author',
        url: 'http://testblog.com',
        likes: 5,
        userId: user.id
      }
      await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog)
    })

    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
      const titles = blogsAtEnd.map(blog => blog.title)
      assert(!titles.includes(blogToDelete.title))
    })

    test('fails with status code 404 if blog does not exist', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const nonExistingId = await helper.nonExistingId()
      await api
        .delete(`/api/blogs/${nonExistingId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length) // Ensure no blog was deleted
    })

    test('fails with status code 400 if id is invalid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const invalidId = '12345invalidid'
      await api
        .delete(`/api/blogs/${invalidId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length) // Ensure no blog was deleted
    })

    test('fails with status code 403 if user is not the creator', async () => {
      // Create another user
      const otherUser = { username: 'otheruser', password: 'testpass' }
      await api.post('/api/users').send(otherUser)
      const otherLoginResponse = await api.post('/api/login').send(otherUser)
      const otherToken = otherLoginResponse.body.token
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(403)
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })

    test('fails with status code 401 if no token is provided', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
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
})

after(async () => {
  await mongoose.connection.close()
})