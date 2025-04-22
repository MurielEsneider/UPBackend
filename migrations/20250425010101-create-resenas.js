'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('resenas', {
      resena_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      usuario_uid: {
        type: Sequelize.STRING(28),
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'uid'
        },
        onDelete: 'CASCADE'
      },
      propiedad_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'propiedades',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      comentario: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      puntuacion: {
        type: Sequelize.DECIMAL(2, 1),
        allowNull: false
      },
      fecha_resena: {  
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('resenas');
  }
};
