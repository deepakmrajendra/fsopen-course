const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../utils/db')

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  disabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user',
  // defaultScope: {
  //   where: {
  //     disabled: false
  //   }
  // },
  // scopes: {
  //   admin: {
  //     where: {
  //       admin: true
  //     }
  //   },
  //   disabled: {
  //     where: {
  //       disabled: true
  //     }
  //   },
  //   name(value) {
  //     return {
  //       where: {
  //         name: {
  //           [Op.iLike]: value
  //         }
  //       }
  //     }
  //   },
})

module.exports = User

// // Scopes are used as follows:
// // all admins
// const adminUsers = await User.scope('admin').findAll()
// // all inactive users
// const disabledUsers = await User.scope('disabled').findAll()
// // users with the string jami in their name
// const jamiUsers = await User.scope({ method: ['name', '%jami%'] }).findAll()
// // It is also possible to chain scopes:
// // admins with the string jami in their name
// const jamiUsers = await User.scope('admin', { method: ['name', '%jami%'] }).findAll()
