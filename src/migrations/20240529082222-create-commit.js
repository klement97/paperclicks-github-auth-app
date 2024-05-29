'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Commits', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            repoName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            sha: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: 'compositeIndex',
            },
            date: {
                type: Sequelize.DATE,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        await queryInterface.addIndex('Commits', ['repoName', 'sha'], {
            unique: true,
            name: 'compositeIndex'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Commits');
    }
};