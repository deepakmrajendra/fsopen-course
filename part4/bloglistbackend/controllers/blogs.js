const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})


blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body
  if (!title || !url) {
    response.status(400).json({ error: 'Title and URL are required' })
    return
  }
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes === undefined ? 0 : likes, // Default to 0 if likes is not provided
  })
  const result = await blog.save()
  response.status(201).json(result)
})


blogsRouter.delete('/:id', async (request, response) => {
  const result = await Blog.findByIdAndDelete(request.params.id)
  if (!result) {
    return response.status(404).json({ error: 'Blog not found' })
  }
  response.status(204).end()
})


blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body
  const updatedBlog = await Blog
    .findByIdAndUpdate(
      request.params.id,
      { title, author, url, likes },
      { new: true , runValidators: true , context: 'query' }
    )
  if (!updatedBlog) {
    return response.status(404).json({ error: 'Blog not found' })
  }
  response.json(updatedBlog)
})

module.exports = blogsRouter
