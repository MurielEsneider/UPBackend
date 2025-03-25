// models/PropiedadImagen.js
"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class PropiedadImagen extends Model {
    static associate(models) {
      PropiedadImagen.belongsTo(models.Propiedad, {
        foreignKey: "propiedad_id",
        as: "propiedad",
        onDelete: "CASCADE"
      });
    }
  }

  PropiedadImagen.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      path: {
        type: DataTypes.STRING,
        allowNull: true
      },
      orden: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      propiedad_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "propiedades",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      }
    },
    {
      sequelize,
      modelName: "PropiedadImagen",
      tableName: "propiedad_imagenes",
      timestamps: false
    }
  );

  return PropiedadImagen;
};
