const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
]


test('dummy test returns one', () => {
  assert.strictEqual(listHelper.dummy([]), 1)
})


describe('totalLikes tests', () => {
  test('total blog likes', () => {
    assert.strictEqual(listHelper.totalLikes(blogs), 36)
  })
  test('total likes of an empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })
})

describe('favoriteBlog test', () => {
  test('returns the blog with most likes', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(blogs), {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    })
  })
  test('returns null if the list is empty', () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null)
  })
})


describe('mostBlogs tests', () => {
  test('returns the author with the most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, { author: "Robert C. Martin", blogs: 3 })
  })
  test('returns null for an empty list', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })
  test('works when there is only one blog in the list', () => {
    const singleBlog = [
      {
        _id: "5a422a851b54a676234d17f7",
        title: "Lovely Mountains!",
        author: "Sam D",
        url: "https://lovelymountains.com/",
        likes: 7,
        __v: 0
      }
    ]
    const result = listHelper.mostBlogs(singleBlog)
    assert.deepStrictEqual(result, { author: "Sam D", blogs: 1 })
  })
})

describe('mostLikes', () => {
  test('author with most likes', () => {
    assert.deepStrictEqual(listHelper.mostLikes(blogs), { author: "Edsger W. Dijkstra", likes: 17 })
  })
  test('empty list returns null', () => {
    assert.strictEqual(listHelper.mostLikes([]), null)
  })
  test('single blog entry should return that author', () => {
    const singleBlog = [{ title: "Blog 1", author: "Sam D", likes: 10 }]
    assert.deepStrictEqual(listHelper.mostLikes(singleBlog), { author: "Sam D", likes: 10 })
  })
})