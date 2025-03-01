const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./reading_lists')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList, as: 'readers' })

// Explicitly associate ReadingList with User and Blog
ReadingList.belongsTo(User, { foreignKey: 'userId', as: 'user' })
ReadingList.belongsTo(Blog, { foreignKey: 'blogId', as: 'blog' })

User.hasMany(Session, { foreignKey: 'userId' })
Session.belongsTo(User, { foreignKey: 'userId' })

module.exports = { Blog, User, ReadingList, Session }