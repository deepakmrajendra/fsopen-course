const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()

const { SECRET } = require('../utils/config')
const { User, Session } = require('../models')

router.post('/', async (request, response) => {

  const { username, password } = request.body

  const user = await User.findOne({ where: { username } })

  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordhash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({ error: 'invalid username or password' })
  }

  if (user.disabled) {
    return response.status(403).json({ error: 'User access revoked' });
  }

  const userForToken = { username: user.username, id: user.id, }
  const token = jwt.sign(userForToken, SECRET, { expiresIn: 60*60 })

  await Session.create({ userId: user.id, token })

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router