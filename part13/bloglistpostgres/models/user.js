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
    allowNull: false,
    validate: {
      isEmail: {
        msg: "Validation isEmail on username failed"
      }
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  passwordhash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  disabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'user'
})

module.exports = User