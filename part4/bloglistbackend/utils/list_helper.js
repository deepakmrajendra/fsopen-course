const _ = require('lodash')


const dummy = (blogs) => {
  return 1
}


const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)
}


const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const topBlog = blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max), blogs[0])
  return {
    title: topBlog.title,
    author: topBlog.author,
    likes: topBlog.likes
  }
}


const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  const blogCounts = _.countBy(blogs, 'author')
  const topAuthor = _.maxBy(Object.keys(blogCounts), (author) => blogCounts[author])
  return {
    author: topAuthor,
    blogs: blogCounts[topAuthor],
  }
}


const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  const likeCounts = _.groupBy(blogs, 'author')
  const authorLikes = _.map(likeCounts, (blogs, author) => ({
    author,
    likes: _.sumBy(blogs, 'likes'),
  }))
  return _.maxBy(authorLikes, 'likes')
}


module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }