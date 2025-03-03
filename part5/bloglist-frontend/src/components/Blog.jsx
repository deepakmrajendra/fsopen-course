import { useState } from 'react'
import PropTypes from 'prop-types'
import blogService from '../services/blogs'

const Blog = ({ blog, blogs, setBlogs, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async () => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1                                          // Increment likes
    }

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)

      // Maintain user details after updating
      setBlogs(blogs.map(b => (b.id === blog.id ? { ...returnedBlog, user: blog.user } : b)))
    } catch (error) {
      console.error('Error updating likes:', error.response?.data || error)
    }
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure, you want to remove blog "${blog.title}" by "${blog.author}"?`)
    if (confirmDelete) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
      } catch (error) {
        console.error('Error deleting blog:', error)
      }
    }
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div>
          <p>
            <a href={blog.url} target="_blank" rel="noopener noreferrer">
              {blog.url}
            </a>
          </p>
          <p>
            likes {blog.likes}
            <button onClick={handleLike}>like</button>
          </p>
          <p>{blog.user?.name || 'Unknown'}</p>
          {user?.username === blog.user?.username && (
            <button onClick={handleDelete} style={{ background: 'red', color: 'white' }}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string // Handle cases where user is stored as an object or ID
    ])
  }).isRequired,
  setBlogs: PropTypes.func.isRequired,
  blogs: PropTypes.array.isRequired,
  user: PropTypes.object
}

export default Blog