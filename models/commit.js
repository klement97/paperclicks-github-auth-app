const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
});

const Commit = sequelize.define('Commit', {
    userId: DataTypes.INTEGER,
    repoName: DataTypes.STRING,
    commitDate: DataTypes.DATE
});

module.exports = {Commit};
