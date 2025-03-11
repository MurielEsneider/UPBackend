
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('arrendadores', {
      uid: {
        type: Sequelize.STRING(28), // 👈 Mismo tipo que en el modelo
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      nombre: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      fotoPerfil: {
        type: Sequelize.STRING(512),  // Longitud para URLs largas
        allowNull: true
      },
      historial_sistema_arriendo: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      documento: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')  // Actualización automática
      }
    });

    // Índice para búsquedas por email
    await queryInterface.addIndex('arrendadores', ['email'], {
      unique: true,
      name: 'idx_arrendador_email'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('arrendadores');
  }
};