const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialBlogs = [
  {
    title: 'Do people still read blogs',
    author: 'Sam D',
    url: 'https://www.pollycloverwrites.com/blog/do-people-still-read-blogs',
    likes: 20
  },
  {
    title: 'Time and its importance in modern thought',
    author: 'Shr D',
    url: 'https://www.amazon.co.uk/TIME-ITS-IMPORTANCE-MODERN-THOUGHT/dp/B001GZTBIU',
    likes: 10
  }
]

// Add initialUsers to establish the correct relationship
const initialUsers = async () => {
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash, })
  return user
}

const nonExistingId = async () => {
  // Create a new temporary blog instance with minimal required fields to be deleted in the next step
  const blog = new Blog({
    title: 'Temporary Title',
    author: 'Temporary Author',
    url: 'http://temporary.url',
    likes: 0
  })
  await blog.save()
  await blog.deleteOne()
  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = { initialBlogs, initialUsers, nonExistingId, blogsInDb, usersInDb }