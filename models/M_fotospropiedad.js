"use strict";
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PropiedadImagen extends Model {
    static associate(models) {
      // Cada imagen pertenece a una propiedad.
      PropiedadImagen.belongsTo(models.Propiedad, { 
        foreignKey: 'propiedad_id',
        as: 'propiedad',
        onDelete: 'CASCADE'
      });
    }
  }

  PropiedadImagen.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // Puedes agregar otros campos, por ejemplo, para indicar el orden o si es la imagen principal.
    orden: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    propiedad_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'propiedades', // Asegúrate de que el nombre coincide con tu tabla de propiedades.
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'PropiedadImagen',
    tableName: 'propiedad_imagenes',
    freezeTableName: true,
    timestamps: false
  });

  return PropiedadImagen;
};
