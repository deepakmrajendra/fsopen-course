const bcrypt = require('bcrypt')
const router = require('express').Router()

const { Blog, User, ReadingList } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordhash', 'createdAt', 'updatedAt'] },
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const { username, name, password } = req.body
  const saltRounds = 10
  const passwordhash = await bcrypt.hash(password, saltRounds)
  const user = await User.create({username, name, passwordhash})
  res.json(user)
})

router.get('/:id', async (req, res) => {

  const { read } = req.query
  const where = {}

  // Validate the read query parameter (it must be 'true' or 'false' if provided)
  if (read !== undefined) {
    if (read !== 'true' && read !== 'false') {
      return res.status(400).json({ error: "Invalid query parameter: 'read' must be 'true' or 'false'" })
    }
    where.read = read === 'true'
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['passwordhash', 'createdAt', 'updatedAt'] },
    include: {
      model: Blog,
      as: 'readings',
      through: { attributes: ['id', 'read'], where },
      attributes: ['id', 'url', 'title', 'author', 'likes', 'year']
    }
  })
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  // Format the response according to the expected structure
  const response = {
    name: user.name,
    username: user.username,
    readings: user.readings.map(blog => ({
      id: blog.id,
      url: blog.url,
      title: blog.title,
      author: blog.author,
      likes: blog.likes,
      year: blog.year,
      readinglists: blog.reading_lists ? [{ 
        read: blog.reading_lists.read, 
        id: blog.reading_lists.id 
      }] : []
    }))
  }

  res.json(response)
})

router.put('/:username', async (req, res, next) => {
  const { username } = req.params
  const { newUsername } = req.body
  if (!newUsername) {
    return res.status(400).json({ error: 'New username is required' })
  }  
  const user = await User.findOne({ where: { username } })  
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }  
  user.username = newUsername
  await user.save()  
  res.json({ message: 'Username updated successfully', user })
})

module.exports = router