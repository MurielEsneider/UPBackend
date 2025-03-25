'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      usuario_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nombres_apellidos: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      fecha_nacimiento: {
        type: Sequelize.DATEONLY,  // 👈 Cambiado a DATEONLY
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
        allowNull: false,
        defaultValue: "aprendiz"  // 👈 Valor por defecto añadido
      }
    });

    // Índice para optimizar búsquedas por correo (opcional pero recomendado)
    await queryInterface.addIndex('usuarios', ['correo_electronico'], {
      unique: true,
      name: 'idx_usuario_correo'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('usuarios');
  }
};