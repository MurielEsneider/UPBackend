const { Reserva, Usuario, Propiedad, Pago } = require('../models');

// Crear una nueva reserva
exports.crearReserva = async (req, res) => {
  try {
    const {
      usuario_uid,
      propiedad_id,
      fecha_inicio,
      fecha_fin,
      hora_llegada,
      monto_reserva,
      observaciones
    } = req.body;

    const nuevaReserva = await Reserva.create({
      usuario_uid,
      propiedad_id,
      fecha_inicio,
      fecha_fin,
      hora_llegada,
      monto_reserva,
      observaciones,
      estado: 'pendiente'
    });

    res.status(201).json(nuevaReserva);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Confirmar una reserva
exports.aceptarReserva = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await Reserva.findByPk(id);
    if (!reserva) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }

    await reserva.update({ estado: 'confirmada' });
    res.json({ mensaje: 'Reserva confirmada', reserva });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancelar una reserva
exports.cancelarReserva = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await Reserva.findByPk(id);
    if (!reserva) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }

    await reserva.update({ estado: 'cancelada' });
    res.json({ mensaje: 'Reserva cancelada', reserva });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las reservas
exports.obtenerReservas = async (req, res) => {
  try {
    const reservas = await Reserva.findAll({
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Propiedad, as: 'propiedad' },
        { model: Pago, as: 'pagos' }
      ]
    });

    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una reserva por ID
exports.obtenerReservaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await Reserva.findByPk(id, {
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Propiedad, as: 'propiedad' },
        { model: Pago, as: 'pagos' }
      ]
    });

    if (!reserva) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }

    res.json(reserva);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener reservas por usuario
exports.obtenerReservasPorUsuario = async (req, res) => {
  try {
    const { usuario_uid } = req.params;

    const reservas = await Reserva.findAll({
      where: { usuario_uid },
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Propiedad, as: 'propiedad' },
        { model: Pago, as: 'pagos' }
      ]
    });

    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener reservas por propiedad
exports.obtenerReservasPorPropiedad = async (req, res) => {
  try {
    const { propiedad_id } = req.params;

    const reservas = await Reserva.findAll({
      where: { propiedad_id },
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Propiedad, as: 'propiedad' },
        { model: Pago, as: 'pagos' }
      ]
    });

    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una reserva
exports.eliminarReserva = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await Reserva.findByPk(id);
    if (!reserva) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }

    await reserva.destroy();
    res.json({ mensaje: 'Reserva eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
