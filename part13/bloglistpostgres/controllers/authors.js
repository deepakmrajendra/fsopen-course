const router = require('express').Router()

const { Blog } = require('../models')

const { fn, col } = require('sequelize')

router.get('/', async (req, res) => {
    const authors = await Blog.findAll({
      attributes: [
        'author',
        [fn('COUNT', col('author')), 'articles'],  // Count blogs per author
        [fn('SUM', col('likes')), 'likes']         // Sum total likes per author
      ],
      group: ['author'],                          // Group by author
      order: [[fn('SUM', col('likes')), 'DESC']]  // Order by total likes DESC
    })
  
    res.json(authors)
  })
  
  module.exports = router