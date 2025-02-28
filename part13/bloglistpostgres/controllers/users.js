const bcrypt = require('bcrypt')
const router = require('express').Router()

const { Blog, User } = require('../models')

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
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end({ error: 'User not found' })
  }
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