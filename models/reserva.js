module.exports = (sequelize, DataTypes) => {
  const Reserva = sequelize.define("Reservas", {
    reserva_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    propiedad_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "confirmada", "cancelada"),
      defaultValue: "pendiente"
    },
    monto_reserva: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    anticipo: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    observaciones: {
      type: DataTypes.TEXT
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: "reservas",
    freezeTableName: true,
    timestamps: false
  });

  Reserva.associate = (models) => {
    Reserva.belongsTo(models.Usuario, { foreignKey: "usuario_id", onDelete: "CASCADE" });
    Reserva.belongsTo(models.Propiedad, { foreignKey: "propiedad_id", onDelete: "CASCADE" });
    Reserva.hasMany(models.Pago, { foreignKey: "reserva_id", onDelete: "CASCADE" });
  };

  return Reserva;
};
