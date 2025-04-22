'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Oferta extends Model {
    static associate(models) {
      // Relación con la Propiedad
      Oferta.belongsTo(models.Propiedad, {
        foreignKey: 'propiedad_id',
        as: 'propiedad',
        onDelete: 'CASCADE'
      });

      // Relación con el Usuario que hace la oferta
      Oferta.belongsTo(models.Usuario, {
        foreignKey: 'usuario_uid',
        as: 'usuario',
        onDelete: 'CASCADE'
      });

      // Si deseas permitir contraofertas, podrías usar esta relación
      Oferta.hasMany(models.Oferta, {
        foreignKey: 'oferta_padre_id',
        as: 'contraofertas'
      });
    }
  }

  Oferta.init({
    oferta_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    propiedad_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'propiedades',
        key: 'id'
      }
    },
    usuario_uid: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'uid'
      }
    },
    precio_ofrecido: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'El precio ofrecido debe ser mayor a cero'
        }
      }
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'aceptada', 'rechazada', 'contrapropuesta'),
      defaultValue: 'pendiente'
    },
    oferta_padre_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'ofertas',
        key: 'oferta_id'
      }
    }
  }, {
    sequelize,
    modelName: 'Oferta',
    tableName: 'ofertas',
    timestamps: true
  });

  return Oferta;
};
