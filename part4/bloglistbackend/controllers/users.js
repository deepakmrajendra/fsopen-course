const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  // Check if both username and password are provided
  if (!username || !password) {
    return response.status(400).json({ error: 'Username and password are required' })
  }
  // Check if username is at least 3 characters
  if (username.length < 3) {
    return response.status(400).json({ error: 'Username must be at least 3 characters long' })
  }
  // Check if password is at least 3 characters
  if (password.length < 3) {
    return response.status(400).json({ error: 'Password must be at least 3 characters long' })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({ username, name, passwordHash, })
  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
  response.json(users)
})

module.exports = usersRouter