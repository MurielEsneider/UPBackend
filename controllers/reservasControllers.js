// controllers/reservaController.js

const { Reserva, Usuario, Propiedad, Pago, sequelize } = require('../models');

// Crear una nueva reserva
const crearReserva = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { 
      usuario_id, 
      propiedad_id, 
      fecha_inicio, 
      fecha_fin, 
      monto_reserva, 
      anticipo, 
      observaciones 
    } = req.body;

    // Verificar que la propiedad existe
    const propiedadExiste = await Propiedad.findByPk(propiedad_id);
    if (!propiedadExiste) {
      await transaction.rollback();
      return res.status(404).json({ mensaje: 'La propiedad no existe' });
    }

    // Verificar que el usuario existe
    const usuarioExiste = await Usuario.findByPk(usuario_id);
    if (!usuarioExiste) {
      await transaction.rollback();
      return res.status(404).json({ mensaje: 'El usuario no existe' });
    }

    // Verificar que la propiedad no esté ya reservada en ese período
    const reservaExistente = await Reserva.findOne({
      where: {
        propiedad_id,
        estado: ['pendiente', 'confirmada'],
        [sequelize.Op.or]: [
          {
            [sequelize.Op.and]: [
              { fecha_inicio: { [sequelize.Op.lte]: fecha_inicio } },
              { fecha_fin: { [sequelize.Op.gte]: fecha_inicio } }
            ]
          },
          {
            [sequelize.Op.and]: [
              { fecha_inicio: { [sequelize.Op.lte]: fecha_fin } },
              { fecha_fin: { [sequelize.Op.gte]: fecha_fin } }
            ]
          },
          {
            [sequelize.Op.and]: [
              { fecha_inicio: { [sequelize.Op.gte]: fecha_inicio } },
              { fecha_fin: { [sequelize.Op.lte]: fecha_fin } }
            ]
          }
        ]
      }
    });

    if (reservaExistente) {
      await transaction.rollback();
      return res.status(400).json({ mensaje: 'La propiedad ya está reservada en esas fechas' });
    }

    // Crear la reserva
    const nuevaReserva = await Reserva.create({
      usuario_id,
      propiedad_id,
      fecha_inicio,
      fecha_fin,
      monto_reserva,
      anticipo: anticipo || 0,
      observaciones,
      estado: 'pendiente'
    }, { transaction });

    // Si hay anticipo, crear un pago asociado
    if (anticipo && anticipo > 0) {
      await Pago.create({
        reserva_id: nuevaReserva.reserva_id,
        monto: anticipo,
        fecha_pago: new Date(),
        metodo_pago: 'anticipo',
        estado: 'completado',
        comprobante: null
      }, { transaction });
    }

    await transaction.commit();
    
    // Obtener la reserva con sus relaciones
    const reservaConRelaciones = await Reserva.findByPk(nuevaReserva.reserva_id, {
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Propiedad, as: 'propiedad' },
        { model: Pago, as: 'pagos' }
      ]
    });

    return res.status(201).json({ 
      mensaje: 'Reserva creada exitosamente', 
      reserva: reservaConRelaciones 
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear la reserva:', error);
    return res.status(500).json({ 
      mensaje: 'Error al crear la reserva', 
      error: error.message 
    });
  }
};

// Obtener todas las reservas
const obtenerReservas = async (req, res) => {
  try {
    const { estado, usuario_id, propiedad_id } = req.query;
    const filtros = {};
    
    // Aplicar filtros si se proporcionan
    if (estado) filtros.estado = estado;
    if (usuario_id) filtros.usuario_id = usuario_id;
    if (propiedad_id) filtros.propiedad_id = propiedad_id;

    const reservas = await Reserva.findAll({
      where: filtros,
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Propiedad, as: 'propiedad' },
        { model: Pago, as: 'pagos' }
      ],
      order: [['fecha_creacion', 'DESC']]
    });

    return res.status(200).json(reservas);
  } catch (error) {
    console.error('Error al obtener las reservas:', error);
    return res.status(500).json({ 
      mensaje: 'Error al obtener las reservas', 
      error: error.message 
    });
  }
};

// Obtener una reserva por ID
const obtenerReservaPorId = async (req, res) => {
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

    return res.status(200).json(reserva);
  } catch (error) {
    console.error('Error al obtener la reserva:', error);
    return res.status(500).json({ 
      mensaje: 'Error al obtener la reserva', 
      error: error.message 
    });
  }
};

// Actualizar una reserva
const actualizarReserva = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { 
      fecha_inicio, 
      fecha_fin, 
      estado, 
      monto_reserva, 
      anticipo, 
      observaciones 
    } = req.body;

    // Verificar que la reserva existe
    const reserva = await Reserva.findByPk(id);
    if (!reserva) {
      await transaction.rollback();
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }

    // Si se cambian las fechas, verificar disponibilidad
    if ((fecha_inicio && fecha_inicio !== reserva.fecha_inicio) || 
        (fecha_fin && fecha_fin !== reserva.fecha_fin)) {
      
      const fechaInicioVerificar = fecha_inicio || reserva.fecha_inicio;
      const fechaFinVerificar = fecha_fin || reserva.fecha_fin;
      
      const reservaExistente = await Reserva.findOne({
        where: {
          propiedad_id: reserva.propiedad_id,
          reserva_id: { [sequelize.Op.ne]: id }, // Excluir la reserva actual
          estado: ['pendiente', 'confirmada'],
          [sequelize.Op.or]: [
            {
              [sequelize.Op.and]: [
                { fecha_inicio: { [sequelize.Op.lte]: fechaInicioVerificar } },
                { fecha_fin: { [sequelize.Op.gte]: fechaInicioVerificar } }
              ]
            },
            {
              [sequelize.Op.and]: [
                { fecha_inicio: { [sequelize.Op.lte]: fechaFinVerificar } },
                { fecha_fin: { [sequelize.Op.gte]: fechaFinVerificar } }
              ]
            },
            {
              [sequelize.Op.and]: [
                { fecha_inicio: { [sequelize.Op.gte]: fechaInicioVerificar } },
                { fecha_fin: { [sequelize.Op.lte]: fechaFinVerificar } }
              ]
            }
          ]
        }
      });

      if (reservaExistente) {
        await transaction.rollback();
        return res.status(400).json({ mensaje: 'La propiedad ya está reservada en esas fechas' });
      }
    }

    // Actualizar la reserva
    await reserva.update({
      fecha_inicio: fecha_inicio || reserva.fecha_inicio,
      fecha_fin: fecha_fin || reserva.fecha_fin,
      estado: estado || reserva.estado,
      monto_reserva: monto_reserva || reserva.monto_reserva,
      anticipo: anticipo !== undefined ? anticipo : reserva.anticipo,
      observaciones: observaciones !== undefined ? observaciones : reserva.observaciones
    }, { transaction });

    // Si se actualiza el anticipo y es mayor que el anterior, crear un nuevo pago
    if (anticipo !== undefined && anticipo > reserva.anticipo) {
      const diferencia = anticipo - reserva.anticipo;
      
      await Pago.create({
        reserva_id: reserva.reserva_id,
        monto: diferencia,
        fecha_pago: new Date(),
        metodo_pago: 'anticipo',
        estado: 'completado',
        comprobante: null
      }, { transaction });
    }

    await transaction.commit();
    
    // Obtener la reserva actualizada con sus relaciones
    const reservaActualizada = await Reserva.findByPk(id, {
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Propiedad, as: 'propiedad' },
        { model: Pago, as: 'pagos' }
      ]
    });

    return res.status(200).json({ 
      mensaje: 'Reserva actualizada exitosamente', 
      reserva: reservaActualizada 
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al actualizar la reserva:', error);
    return res.status(500).json({ 
      mensaje: 'Error al actualizar la reserva', 
      error: error.message 
    });
  }
};

// Eliminar una reserva
const eliminarReserva = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    // Verificar que la reserva existe
    const reserva = await Reserva.findByPk(id);
    if (!reserva) {
      await transaction.rollback();
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }

    // Primero eliminar los pagos asociados
    await Pago.destroy({
      where: { reserva_id: id },
      transaction
    });

    // Luego eliminar la reserva
    await reserva.destroy({ transaction });

    await transaction.commit();
    
    return res.status(200).json({ 
      mensaje: 'Reserva eliminada exitosamente' 
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al eliminar la reserva:', error);
    return res.status(500).json({ 
      mensaje: 'Error al eliminar la reserva', 
      error: error.message 
    });
  }
};

// Cancelar una reserva
const cancelarReserva = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    
    // Verificar que la reserva existe
    const reserva = await Reserva.findByPk(id);
    if (!reserva) {
      await transaction.rollback();
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }

    // Verificar que la reserva no esté ya cancelada
    if (reserva.estado === 'cancelada') {
      await transaction.rollback();
      return res.status(400).json({ mensaje: 'La reserva ya está cancelada' });
    }

    // Actualizar el estado y añadir motivo a las observaciones
    let nuevasObservaciones = reserva.observaciones || '';
    if (motivo) {
      nuevasObservaciones += (nuevasObservaciones ? '\n' : '') + 
                             `[${new Date().toISOString()}] Cancelación: ${motivo}`;
    }

    await reserva.update({
      estado: 'cancelada',
      observaciones: nuevasObservaciones
    }, { transaction });

    await transaction.commit();
    
    return res.status(200).json({ 
      mensaje: 'Reserva cancelada exitosamente', 
      reserva: await Reserva.findByPk(id)
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al cancelar la reserva:', error);
    return res.status(500).json({ 
      mensaje: 'Error al cancelar la reserva', 
      error: error.message 
    });
  }
};

// Confirmar una reserva
const confirmarReserva = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    // Verificar que la reserva existe
    const reserva = await Reserva.findByPk(id);
    if (!reserva) {
      await transaction.rollback();
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }

    // Verificar que la reserva esté pendiente
    if (reserva.estado !== 'pendiente') {
      await transaction.rollback();
      return res.status(400).json({ 
        mensaje: `No se puede confirmar una reserva en estado "${reserva.estado}"` 
      });
    }

    // Actualizar el estado
    await reserva.update({
      estado: 'confirmada'
    }, { transaction });

    await transaction.commit();
    
    return res.status(200).json({ 
      mensaje: 'Reserva confirmada exitosamente', 
      reserva: await Reserva.findByPk(id)
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al confirmar la reserva:', error);
    return res.status(500).json({ 
      mensaje: 'Error al confirmar la reserva', 
      error: error.message 
    });
  }
};

module.exports = {
  crearReserva,
  obtenerReservas,
  obtenerReservaPorId,
  actualizarReserva,
  eliminarReserva,
  cancelarReserva,
  confirmarReserva
};
