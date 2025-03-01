const router = require('express').Router()
const { ReadingList, Blog, User } = require('../models')
const { tokenExtractor } = require('../utils/middleware')

router.post('/', tokenExtractor, async (req, res) => {
  const { blogId } = req.body
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.findByPk(blogId)

  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' })
  }

  const reading = await ReadingList.create({ userId: user.id, blogId, read: false })
  res.status(201).json(reading)
})

router.get('/', async (req, res) => {
  const readingLists = await ReadingList.findAll({
    include: [
      { model: User, as: 'user', attributes: ['id', 'username', 'name'] },
      { model: Blog, as: 'blog', attributes: ['id', 'title', 'author'] }
    ]
  })
  res.json(readingLists)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const { read } = req.body

  if (typeof read !== 'boolean') {
    return res.status(400).json({ error: 'Invalid input: read must be true or false' })
  }

  const reading = await ReadingList.findByPk(req.params.id)

  if (!reading) {
    return res.status(404).json({ error: 'Reading list entry not found' })
  }

  if (reading.userId !== req.decodedToken.id) {
    return res.status(403).json({ error: 'Permission denied: : You can only mark your own reading list entries as read' })
  }

  reading.read = read
  await reading.save()
  res.json({ message: 'Reading list updated', reading })
})

module.exports = router
