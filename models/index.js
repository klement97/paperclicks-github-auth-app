const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
});

const User = sequelize.define('User', {
    githubId: {
        type: DataTypes.STRING,
        unique: true,
    },
    username: DataTypes.STRING,
    displayName: DataTypes.STRING,
    accessToken: DataTypes.STRING,
});

module.exports = {sequelize, User};
