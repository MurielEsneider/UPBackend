'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Propiedad extends Model {
    static associate(models) {
      // Una propiedad pertenece a un arrendador
      Propiedad.belongsTo(models.Arrendador, { 
        foreignKey: 'arrendador_id', 
        as: 'arrendador',
        onDelete: 'CASCADE'
      });

      // Una propiedad puede tener muchas características
      Propiedad.hasMany(models.CaracteristicaPropiedad, { 
        foreignKey: 'propiedad_id', 
        as: 'caracteristicas',
        onDelete: 'CASCADE'
      });

      // Una propiedad puede estar en muchas publicaciones (habitaciones)
      Propiedad.hasMany(models.Publicacion, { 
        foreignKey: 'propiedad_id', 
        as: 'publicaciones',
        onDelete: 'CASCADE'
      });

      // Una propiedad puede tener muchas reservas
      Propiedad.hasMany(models.Reserva, { 
        foreignKey: 'propiedad_id', 
        as: 'reservas',
        onDelete: 'CASCADE'
      });

      // Una propiedad puede tener muchas citas
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
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    arrendador_id: {  // Clave foránea actualizada
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'arrendador',  // Referencia a la tabla correcta
        key: 'uid'  // Coincide con la PK de Arrendador
      },
      onDelete: 'CASCADE'
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('disponible', 'ocupada', 'mantenimiento'),
      allowNull: false,
      defaultValue: 'disponible'
    }
  }, {
    sequelize,
    modelName: 'Propiedad',
    freezeTableName: true,
    tableName: 'Propiedades',  // Nombre de tabla en snake_case
    timestamps: false  // Si no usas los timestamps automáticos
  });

  return Propiedad;
};