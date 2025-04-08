'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('propiedades', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: 'Identificador único de la propiedad'
      },
      titulo: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
          len: [5, 100]
        }
      },
      descripcion: {
        type: Sequelize.TEXT,
        validate: {
          len: [0, 2000]
        }
      },
      direccion: {
        type: Sequelize.STRING,
        allowNull: false
      },
      precio: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0
        }
      },
      arrendador_uid: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'arrendadores',
          key: 'uid'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      lat: {
        type: Sequelize.FLOAT,
        allowNull: false,
        comment: 'Latitud geográfica'
      },
      lng: {
        type: Sequelize.FLOAT,
        allowNull: false,
        comment: 'Longitud geográfica'
      },
      estado: {
        type: Sequelize.ENUM('disponible', 'ocupado', 'mantenimiento'),
        defaultValue: 'disponible'
      },
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      habilitado: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Índices
    await queryInterface.addIndex('propiedades', ['arrendador_uid']);
    await queryInterface.addIndex('propiedades', ['precio']);
    await queryInterface.addIndex('propiedades', ['lat', 'lng']);
    await queryInterface.addIndex('propiedades', ['estado']);
    await queryInterface.addIndex('propiedades', ['createdAt']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('propiedades');
  }
};
