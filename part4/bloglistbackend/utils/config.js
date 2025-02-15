// Load environment variables from .env file and makes the variables available via process.env.
// The environment variables defined in dotenv will only be used when the backend is not in production mode, i.e. Fly.io or Render.
// For production, we have to set the database URL in the service that is hosting our app. In Fly.io that is done by using "fly secrets set"
require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

module.exports = { MONGODB_URI, PORT }