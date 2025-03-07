module.exports = (sequelize, DataTypes) => {
  const Pago = sequelize.define('Pago', {
    reserva_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Reservas', // Asegúrate de que el nombre coincide con el modelo de la tabla reservas
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fecha_pago: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    metodo_pago: {
      type: DataTypes.ENUM('tarjeta_credito', 'transferencia_bancaria', 'efectivo'),
      allowNull: false,
    },
    estado_pago: {
      type: DataTypes.ENUM('pendiente', 'completado', 'rechazado'),
      defaultValue: 'pendiente',
    },
    referencia_transaccion: {
      type: DataTypes.STRING(100),
    },
    comprobante_url: {
      type: DataTypes.STRING(255),
    },
  }, {});

  Pago.associate = function(models) {
    Pago.belongsTo(models.Reserva, { foreignKey: 'reserva_id', onDelete: 'CASCADE' });
  };

  return Pago;
};
