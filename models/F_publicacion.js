'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Publicacion extends Model {
    static associate(models) {
      Publicacion.belongsTo(models.Propiedad, {
        foreignKey: 'propiedad_id',
        as: 'propiedad',
        onDelete: 'CASCADE'
      });

      Publicacion.belongsToMany(models.Usuario, {
        through: 'publicaciones_guardadas',
        foreignKey: 'publicacion_id',
        otherKey: 'usuario_uid',  // 👈 Clave faltante
        as: 'usuariosGuardaron'
      });
    }
  }

  Publicacion.init({
    publicacion_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    propiedad_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'propiedades',  // 👈 Tabla corregida
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    titulo: {  // 👈 Campos faltantes en el modelo
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fecha_publicacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Publicacion',
    tableName: 'publicaciones',
    freezeTableName: true,
    timestamps: false  // Coincide con fecha_publicacion personalizada
  });

  return Publicacion;
};