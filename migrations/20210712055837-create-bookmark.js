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
        onDelete: 'cascade',
      },
      categoryId: {
        type: Sequelize.INTEGER,
        field: 'categoryId',
        references: {
          model: 'Categories',
          key: 'id',
        },
        onDelete: 'cascade',
      },
      position: {
        type: Sequelize.INTEGER,
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