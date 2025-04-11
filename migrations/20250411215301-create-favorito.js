'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Favoritos', {
      usuario_uid: {
        type: Sequelize.STRING(28),
        primaryKey: true,
        references: {
          model: 'Usuarios',
          key: 'uid'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      propiedad_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Propiedades',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Favoritos');
  }
};