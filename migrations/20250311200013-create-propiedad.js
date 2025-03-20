'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('propiedades', {
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
      descripcion: {
        type: Sequelize.TEXT
      },
      direccion: {
        type: Sequelize.STRING,
        allowNull: false
      },
      precio: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      publicado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      arrendador_uid: { // <== Columna definida aquí
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "arrendadores",
          key: "uid"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
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

    // Índices para búsquedas comunes
    await queryInterface.addIndex('propiedades', ['arrendador_uid']); // Actualizado a arrendador_uid
    await queryInterface.addIndex('propiedades', ['precio']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('propiedades');
  }
};
