const express = require('express');
const router = express.Router();

const configs = require('../util/config')
const redis = require('../redis')

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

router.get('/statistics', async (req, res) => {
  // Get the number of added todos from Redis
  let addedTodos = await redis.getAsync('added_todos')
  addedTodos = addedTodos ? parseInt(addedTodos) : 0  // Default to 0 if undefined

  // Return the counter as JSON
  res.json({ added_todos: addedTodos })
})

module.exports = router;
