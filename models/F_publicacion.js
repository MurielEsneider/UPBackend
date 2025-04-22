'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Publicacion extends Model {
    static associate(models) {
      // Relación con Propiedad
      Publicacion.belongsTo(models.Propiedad, {
        foreignKey: 'propiedad_id',
        as: 'propiedad',
        onDelete: 'CASCADE'
      });

      // Relación Muchos a Muchos (Publicaciones guardadas)
      Publicacion.belongsToMany(models.Usuario, {
        through: 'publicaciones_guardadas',
        foreignKey: 'publicacion_id',
        otherKey: 'usuario_uid',
        as: 'usuariosGuardaron'
      });

      // Relación 1:N con Reseñas
      Publicacion.hasMany(models.Resena, {
        foreignKey: 'publicacion_id',
        as: 'resenas',
        onDelete: 'CASCADE'
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
        model: 'propiedades',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    titulo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: true }
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
    timestamps: false
  });

  return Publicacion;
};
