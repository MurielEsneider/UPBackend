'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Propiedad extends Model {
    static associate(models) {
      Propiedad.belongsTo(models.Arrendador, { 
        foreignKey: 'arrendador_uid',  // 👈 Nombre más descriptivo
        as: 'arrendador',
        onDelete: 'CASCADE'
      });

      Propiedad.hasMany(models.CaracteristicaPropiedad, {
        foreignKey: 'propiedad_id',
        as: 'caracteristicas',
        onDelete: 'CASCADE'
      });

      Propiedad.hasMany(models.Publicacion, {
        foreignKey: 'propiedad_id',
        as: 'publicaciones',
        onDelete: 'CASCADE'
      });

      Propiedad.hasMany(models.Reserva, {
        foreignKey: 'propiedad_id',
        as: 'reservas',
        onDelete: 'CASCADE'
      });

      Propiedad.hasMany(models.Cita, {
        foreignKey: 'propiedad_id',
        as: 'citas',
        onDelete: 'CASCADE'
      });
    }
  }

  Propiedad.init({
    propiedad_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    arrendador_uid: { 
      type: DataTypes.STRING(28), // 👈 Debe coincidir con Arrendador.uid
      allowNull: false,
      references: {
        model: 'arrendadores',
        key: 'uid'
      },
      onDelete: 'CASCADE'
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0  // Precio no puede ser negativo
      }
    },
    estado: {
      type: DataTypes.ENUM('disponible', 'ocupada', 'mantenimiento'),
      allowNull: false,
      defaultValue: 'disponible'
    }
  }, {
    sequelize,
    modelName: 'Propiedad',
    tableName: 'propiedades',
    freezeTableName: true,
    timestamps: false
  });

  return Propiedad;
};


