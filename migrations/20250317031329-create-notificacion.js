'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Notificacion', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titulo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mensaje: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios', // Debe existir la tabla Usuarios
          key: 'usuario_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      arrendador_uid: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "arrendadores", // Nombre de la tabla
          key: "uid"            // Clave primaria del propietario
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      leida: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Notificacion');
  }
};
