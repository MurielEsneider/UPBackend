'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Aprendiz extends Model {
    static associate(models) {
      Aprendiz.belongsTo(models.Usuario, { 
        foreignKey: "usuario_id", 
        onDelete: "CASCADE"
      });
    }
  }

  Aprendiz.init({
    usuario_id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      allowNull: false 
    },
    programa_formacion: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    ficha: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    identificacion_sena: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true 
    }
  }, {
    sequelize,
    modelName: "Aprendiz",
    timestamps: false, // Si no necesitas createdAt y updatedAt
  });

  return Aprendiz;
};
