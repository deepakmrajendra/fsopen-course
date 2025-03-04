const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
// const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')

const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

// let authors = [
//   {
//     name: 'Robert Martin',
//     id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//     born: 1952,
//   },
//   {
//     name: 'Martin Fowler',
//     id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//     born: 1963
//   },
//   {
//     name: 'Fyodor Dostoevsky',
//     id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//     born: 1821
//   },
//   { 
//     name: 'Joshua Kerievsky', // birthyear not known
//     id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//   },
//   { 
//     name: 'Sandi Metz', // birthyear not known
//     id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//   },
// ]

/*
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
*/

// let books = [
//   {
//     title: 'Clean Code',
//     published: 2008,
//     author: 'Robert Martin',
//     id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Agile software development',
//     published: 2002,
//     author: 'Robert Martin',
//     id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//     genres: ['agile', 'patterns', 'design']
//   },
//   {
//     title: 'Refactoring, edition 2',
//     published: 2018,
//     author: 'Martin Fowler',
//     id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Refactoring to patterns',
//     published: 2008,
//     author: 'Joshua Kerievsky',
//     id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'patterns']
//   },  
//   {
//     title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
//     published: 2012,
//     author: 'Sandi Metz',
//     id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'design']
//   },
//   {
//     title: 'Crime and punishment',
//     published: 1866,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'crime']
//   },
//   {
//     title: 'Demons',
//     published: 1872,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'revolution']
//   },
// ]

/*
  you can remove the placeholder query once your first one has been implemented 
*/

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    addAuthor(
      name: String!
      born: Int
    ): Author
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    // bookCount: () => books.length,
    bookCount: () => Book.collection.countDocuments(),

    // authorCount: () => authors.length,
    authorCount: () => Author.collection.countDocuments(),

    // allBooks: (root, args) => {
    //   let filteredBooks = books
    //   if (args.author) {
    //     filteredBooks = filteredBooks.filter(book => book.author === args.author)
    //   }
    //   if (args.genre) {
    //     filteredBooks = filteredBooks.filter(book => book.genres.includes(args.genre))
    //   }
    //   return filteredBooks
    // },

    allBooks: async (root, args) => {
      let query = {}
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) return []
        query.author = author._id
      }
      if (args.genre) {
        query.genres = { $in: [args.genre] }
      }
      return await Book.find(query).populate('author', { name: 1 })
    },
    
    // allAuthors: () => {
    //   return authors.map(author => ({
    //     name: author.name,
    //     born: author.born,
    //     bookCount: books.filter(book => book.author === author.name).length
    //   }))
    // }

    allAuthors: async () => {
      const authors = await Author.find({})
      const books = await Book.find({})

      return authors.map(author => ({
        name: author.name,
        born: author.born,
        bookCount: books.filter(book => book.author.toString() === author._id.toString()).length
      }))
    },

    me: (root, args, context) => {
      return context.currentUser
    }
  },

  Mutation: {

    createUser: async (root, args) => {
      try {
        const user = new User({ ...args })
        return await user.save()
      } catch (error) {
        throw new GraphQLError('Failed to create user', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args, error }
        })
      }
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('Invalid username or password', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      }
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },

    // addAuthor: (root, args) => {
    //   // Check if author already exists
    //   if (authors.find(a => a.name === args.name)) {
    //     throw new GraphQLError('Author Name must be unique', {
    //         extensions: {
    //           code: 'BAD_USER_INPUT',
    //           invalidArgs: args.name
    //         }
    //       })
    //   }
    //   const newAuthor = { ...args, id: uuid() }
    //   authors = authors.concat(newAuthor)
    //   return newAuthor
    // },

    addAuthor: async (root, args, context) => {
      // Check if the user is authenticated
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        })
      }
      try {
        const newAuthor = new Author({ ...args })
        return await newAuthor.save()
      } catch (error) {
        // Handle specific Mongoose validation errors
        if (error.name === 'ValidationError') {
          const validationErrors = Object.values(error.errors).map(err => err.message)
          throw new GraphQLError(`Validation Error: ${validationErrors.join(', ')}`, {
            extensions: { code: 'BAD_USER_INPUT', invalidArgs: args, error }
          })
        } else {
          // Handle any other errors
          throw new GraphQLError('Failed to add author', {
          extensions: { code: 'INTERNAL_SERVER_ERROR', error }
          })
        }
      }
    },

    // addBook: (root, args, context) => {
    //   // Check if the author exists; if not, add them using addAuthor
    //   let author = authors.find(a => a.name === args.author)
    //   if (!author) {
    //     author = resolvers.Mutation.addAuthor(root, { name: args.author })  // Call addAuthor
    //   }
    //   const newBook = { ...args, id: uuid() }
    //   books = books.concat(newBook)
    //   return newBook
    // },

    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Unauthorized access', {
          extensions: { code: 'UNAUTHORIZED' }
        })
      }
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
      }
      try {
        const newBook = new Book({ ...args, author: author._id })
        return await newBook.save()
      } catch (error) {
        // Handle specific Mongoose validation errors
        if (error.name === 'ValidationError') {
          const validationErrors = Object.values(error.errors).map(err => err.message)
          throw new GraphQLError(`Validation Error: ${validationErrors.join(', ')}`, {
            extensions: { code: 'BAD_USER_INPUT', invalidArgs: args, error }
          })
        } else {
          // Handle any other errors
          throw new GraphQLError('Failed to add book', {
          extensions: { code: 'INTERNAL_SERVER_ERROR', error }
          })
        }
      }
    },

    // editAuthor: (root, args) => {
    //   const author = authors.find(a => a.name === args.name)
    //   if (!author) {
    //     return null
    //   }
    //   author.born = args.setBornTo
    //   return author
    // }

    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Unauthorized access', {
          extensions: { code: 'UNAUTHORIZED' }
        })
      }
      const author = await Author.findOne({ name: args.name })
      if (!author) return null
      author.born = args.setBornTo
      return await author.save()
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      try {
        const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
        const currentUser = await User.findById(decodedToken.id)
        return { currentUser }
      } catch (error) {
        throw new GraphQLError('Invalid token', {
          extensions: { code: 'UNAUTHORIZED' }
        })
      }
    }
  }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})