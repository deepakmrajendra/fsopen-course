import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {

  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState({ message: null, isSuccess: false })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(returnedBlog))
      // Success Notification
      setNotification({
        message: `A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`,
        isSuccess: true
      })
      setTimeout(() => setNotification({ message: null }), 5000)
    } catch (error) {
      // Error Notification
      setNotification({
        message: 'Failed to add new blog. Please try again.',
        isSuccess: false
      })
      setTimeout(() => setNotification({ message: null }), 5000)
    }
  }

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setNotification({ message: 'Wrong username or password', isSuccess: false })
      setTimeout(() => setNotification({ message: null }), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  // Sorting blogs by likes in descending order**
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    user === null ? (
      <div>
        <h2>log in to application</h2>
        <Notification message={notification.message} isSuccess={notification.isSuccess} />
        <LoginForm handleLogin={handleLogin} />
      </div>
    ) : (
      <div>
        <h2>blogs</h2>
        <Notification message={notification.message} isSuccess={notification.isSuccess} />
        <p>{user.name} logged in
          <button onClick={handleLogout}>Logout</button>
        </p>
        <h2>create new blog</h2>
        <Togglable buttonLabel="new blog" >
          <BlogForm createBlog={addBlog} />
        </Togglable>
        {sortedBlogs.map(blog =>
          <Blog key={blog.id} blog={blog} blogs={blogs} setBlogs={setBlogs} user={user} />
        )}
      </div>
    )
  )
}

export default App