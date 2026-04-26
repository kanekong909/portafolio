const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_PATH || path.join(__dirname, 'database.sqlite'),
  logging: false
});

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false }
});

const Project = sequelize.define('Project', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  longDescription: { type: DataTypes.TEXT },
  image: { type: DataTypes.STRING },
  tags: { type: DataTypes.STRING }, // comma separated
  liveUrl: { type: DataTypes.STRING },
  githubUrl: { type: DataTypes.STRING },
  featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.ENUM('draft', 'published'), defaultValue: 'published' }
});

module.exports = { sequelize, User, Project };
