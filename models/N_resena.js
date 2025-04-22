'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Resena extends Model {
    static associate(models) {
      // Reseña pertenece a un Usuario
      Resena.belongsTo(models.Usuario, {
        foreignKey: 'usuario_uid',
        as: 'autor',
        onDelete: 'CASCADE'
      });
      
      // Reseña pertenece a una Propiedad
      Resena.belongsTo(models.Propiedad, {
        foreignKey: 'propiedad_id',
        as: 'propiedad',
        onDelete: 'CASCADE'
      });
    }
  }

  Resena.init({
    resena_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    usuario_uid: {
      type: DataTypes.STRING(28),
      allowNull: false
    },
    propiedad_id: {  
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    puntuacion: {
      type: DataTypes.DECIMAL(2, 1), 
      validate: {
        min: 1,
        max: 5
      }
    },
    fecha_reseña: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Resena',
    tableName: 'resenas',
    freezeTableName: true,
    timestamps: false
  });

  return Resena;
};