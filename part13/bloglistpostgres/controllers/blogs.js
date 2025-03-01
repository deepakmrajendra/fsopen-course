const router = require('express').Router()
const jwt = require('jsonwebtoken')

const { Blog, User } = require('../models')
const { tokenExtractor } = require('../utils/middleware')

const { Op } = require('sequelize')

router.get('/', async (req, res) => {
  const where = {}
  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.substring]: req.query.search } },
      { author: { [Op.substring]: req.query.search } }
    ]
  }
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [['likes', 'DESC']] 
  })
  console.log(JSON.stringify(blogs, null, 2))
  res.json(blogs)
})


router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  const blog = await Blog.create({...req.body, userId: user.id })
  return res.status(201).json(blog)
})


const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).json({ error: 'Blog not found' })
  }
  next()
}


router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
  // Ensure only the creator can delete the blog
  if (req.blog.userId !== req.decodedToken.id) {
    return res.status(403).json({ error: 'Permission denied: Only the creator can delete this blog' })
  }
  await req.blog.destroy()
  return res.status(204).end()
})


router.put('/:id', blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes
  await req.blog.save()
  res.json({ likes: req.blog.likes })
})

module.exports = router