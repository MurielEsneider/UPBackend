'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      uid: {
        type: Sequelize.STRING(28), // Mismo tipo que en el modelo
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      nombres_apellidos: {
        type: Sequelize.STRING, // Se puede ajustar la longitud si es necesario
        allowNull: false
      },
      fecha_nacimiento: {
        type: Sequelize.DATEONLY,  // Fecha sin hora
        allowNull: true
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      fotoPerfil: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });

    // Índice para optimizar búsquedas por email (opcional pero recomendado)
    await queryInterface.addIndex('usuarios', ['email'], {
      unique: true,
      name: 'idx_usuario_email'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('usuarios');
  }
};
