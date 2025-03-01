const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const { User, Session } = require('../models')

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'SequelizeValidationError') {
      return response.status(400).json({ error: error.errors.map(e => e.message) })
  }
  if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).json({ error: 'Invalid database operation' })
  }
  if (error.name === 'TypeError') {
    return response.status(400).json({ error: 'Invalid request data' })
  }
  next(error)
}

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'token missing' })
  }

  const token = authorization.substring(7)
  const session = await Session.findOne({ where: { token } })

  if (!session) {
    return res.status(401).json({ error: 'invalid or expired token' })
  }

  const user = await User.findByPk(session.userId)
  if (!user || user.disabled) {
    return res.status(403).json({ error: 'User access revoked' })
  }

  req.decodedToken = { id: user.id, username: user.username }
  next()
}
  
module.exports = { errorHandler, tokenExtractor }