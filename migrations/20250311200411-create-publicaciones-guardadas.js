'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('publicaciones_guardadas', {
      id: { // 👈 Opcional: Puedes usar un id o una clave compuesta
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      publicacion_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'publicaciones',
          key: 'publicacion_id'
        },
        onDelete: 'CASCADE'
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'usuario_id'
        },
        onDelete: 'CASCADE'
      }
    });

    // Índice único para evitar duplicados
    await queryInterface.addIndex('publicaciones_guardadas', ['publicacion_id', 'usuario_id'], {
      unique: true,
      name: 'idx_unique_publicacion_usuario'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('publicaciones_guardadas');
  }
};