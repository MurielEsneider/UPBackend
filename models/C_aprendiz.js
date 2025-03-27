'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Aprendiz extends Model {
    static associate(models) {
      Aprendiz.belongsTo(models.Usuario, { 
        foreignKey: "usuario_uid", 
        onDelete: "CASCADE"
      });
    }
  }

  Aprendiz.init({
    aprendiz_id: {  // 👈 Nombre consistente para PK
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    usuario_uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {  // 👈 Referencia añadida
        model: 'usuarios',
        key: 'uid'
      }
    },
    programa_formacion: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    ficha: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      validate: {
        isInt: true
      }
    },
    identificacion_sena: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true 
    }
  }, {
    sequelize,
    modelName: "Aprendiz",  // 👈 En PascalCase y singular
    tableName: 'aprendices',  // 👈 Nombre de tabla en plural
    timestamps: true  // Coincide con la migración
  });

  return Aprendiz;
};
