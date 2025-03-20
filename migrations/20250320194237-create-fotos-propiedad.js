'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('propiedad_imagenes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      orden: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      propiedad_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'propiedades', // Nombre de la tabla de propiedades
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
      // Si en tu modelo no usas timestamps, puedes omitir estos campos
      // createdAt: {
      //   allowNull: false,
      //   type: Sequelize.DATE,
      //   defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      // },
      // updatedAt: {
      //   allowNull: false,
      //   type: Sequelize.DATE,
      //   defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      // }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('propiedad_imagenes');
  }
};
