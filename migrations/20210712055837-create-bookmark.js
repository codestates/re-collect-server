'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Bookmarks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        field: 'userId',
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      listId: {
        type: Sequelize.INTEGER,
        field: 'listId',
        references: {
          model: 'Bookmarks',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      text: {
        type: Sequelize.TEXT
      },
      url: {
        type: Sequelize.STRING(2083)
      },
      importance: {
        type: Sequelize.TINYINT
      },
      color: {
        type: Sequelize.TEXT
      },
      visitCounts: {
        type: Sequelize.INTEGER
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Bookmarks');
  }
};