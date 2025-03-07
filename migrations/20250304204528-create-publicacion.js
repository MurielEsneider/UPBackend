// Migración corregida para PublicacionGuardada
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('publicacionesGuardadas', { // Nombre de tabla en snake_case
      publicacion_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'publicaciones', // Nombre correcto de la tabla
          key: 'publicacion_id'
        },
        onDelete: 'CASCADE'
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios', // Nombre de tabla en plural
          key: 'usuario_id'
        },
        onDelete: 'CASCADE'
      },
      arrendador_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'arrendadores', // Nombre de tabla corregido
          key: 'uid' // Clave correcta
        },
        onDelete: 'CASCADE'
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

    // Añadir clave primaria compuesta
    await queryInterface.addConstraint('publicaciones_guardadas', {
      fields: ['publicacion_id', 'usuario_id', 'arrendador_id'],
      type: 'primary key'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('publicacionesGuardadas'); // Nombre consistente
  }
};