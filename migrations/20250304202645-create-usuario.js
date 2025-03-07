'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Usuario', {
      usuario_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nombres_apellidos: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fecha_nacimiento: {
        type: Sequelize.DATE,
        allowNull: true
      },
      numero_telefono: {
        type: Sequelize.STRING(15),
        allowNull: false
      },
      correo_electronico: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      rol: {
        type: Sequelize.ENUM("administrador", "arrendador", "aprendiz"),
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Usuario');
  }
};