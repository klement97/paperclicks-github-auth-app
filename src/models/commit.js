'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Commit extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    Commit.init({
        repoName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sha: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: 'compositeIndex',
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Commit',
        indexes: [
            {
                unique: true,
                fields: ['repoName', 'sha']
            }
        ]
    });
    return Commit;
};