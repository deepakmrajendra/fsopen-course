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
  
module.exports = { errorHandler }