const { Cita, Usuario, Propiedad } = require('../models');

// Crear una nueva cita
exports.crearCita = async (req, res) => {
  try {
    const { usuario_uid, propiedad_id, fecha, hora } = req.body;

    // Validar campos requeridos
    if (!usuario_uid || !propiedad_id || !fecha || !hora) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Verificar si el usuario existe
    const usuario = await Usuario.findByPk(usuario_uid);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si la propiedad existe
    const propiedad = await Propiedad.findByPk(propiedad_id);
    if (!propiedad) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }

    // Validar formato de fecha y hora (puedes agregar más validaciones)
    if (isNaN(Date.parse(fecha))) {
      return res.status(400).json({ error: 'Formato de fecha inválido' });
    }

    const nuevaCita = await Cita.create({
      usuario_uid,
      propiedad_id,
      fecha: new Date(fecha),
      hora,
      estado: 'pendiente',
      fecha_creacion: new Date()
    });

    res.status(201).json({
      mensaje: 'Cita creada exitosamente',
      cita: nuevaCita
    });
  } catch (error) {
    console.error('Error al crear cita:', error);
    res.status(500).json({ 
      error: 'Error al crear la cita',
      detalles: error.message 
    });
  }
};

// Confirmar una cita
exports.aceptarCita = async (req, res) => {
  try {
    const { id } = req.params;

    const cita = await Cita.findByPk(id);
    if (!cita) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }

    await cita.update({ estado: 'confirmada' });
    res.json({ 
      mensaje: 'Cita confirmada exitosamente', 
      cita 
    });
  } catch (error) {
    console.error('Error al confirmar cita:', error);
    res.status(500).json({ 
      error: 'Error al confirmar la cita',
      detalles: error.message 
    });
  }
};

// Cancelar una cita
exports.cancelarCita = async (req, res) => {
  try {
    const { id } = req.params;

    const cita = await Cita.findByPk(id);
    if (!cita) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }

    await cita.update({ estado: 'cancelada' });
    res.json({ 
      mensaje: 'Cita cancelada exitosamente', 
      cita 
    });
  } catch (error) {
    console.error('Error al cancelar cita:', error);
    res.status(500).json({ 
      error: 'Error al cancelar la cita',
      detalles: error.message 
    });
  }
};

// Obtener todas las citas
exports.obtenerCitas = async (req, res) => {
  try {
    const citas = await Cita.findAll({
      include: [
        { 
          model: Usuario, 
          as: 'usuario', 
          attributes: ['uid', 'nombre', 'fotoPerfil'] 
        },
        { 
          model: Propiedad, 
          as: 'propiedad', 
          attributes: ['uid', 'titulo'] 
        }
      ],
      order: [['fecha_creacion', 'DESC']]
    });

    const citasFormateadas = citas.map(cita => ({
      uid: cita.uid,
      usuario: cita.usuario,
      propiedad: cita.propiedad,
      fecha: cita.fecha,
      hora: cita.hora,
      estado: cita.estado,
      fecha_creacion: cita.fecha_creacion,
      monto_reserva: cita.monto_reserva || 100000
    }));

    res.json(citasFormateadas);
  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).json({ 
      error: 'Error al obtener las citas',
      detalles: error.message 
    });
  }
};

// Obtener una cita por ID
exports.obtenerCitaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const cita = await Cita.findByPk(id, {
      include: [
        { 
          model: Usuario, 
          as: 'usuario',
          attributes: { exclude: ['password'] } 
        },
        { 
          model: Propiedad, 
          as: 'propiedad' 
        }
      ]
    });

    if (!cita) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }

    res.json(cita);
  } catch (error) {
    console.error('Error al obtener cita:', error);
    res.status(500).json({ 
      error: 'Error al obtener la cita',
      detalles: error.message 
    });
  }
};

// Obtener citas por usuario
exports.obtenerCitasPorUsuario = async (req, res) => {
  try {
    const { usuario_uid } = req.params;

    const citas = await Cita.findAll({
      where: { usuario_uid },
      include: [
        { 
          model: Propiedad, 
          as: 'propiedad',
          attributes: ['uid', 'titulo', 'imagenPrincipal'] 
        }
      ],
      order: [['fecha', 'DESC'], ['hora', 'DESC']]
    });

    if (!citas || citas.length === 0) {
      return res.status(404).json({ 
        mensaje: 'No se encontraron citas para este usuario' 
      });
    }

    res.json(citas);
  } catch (error) {
    console.error('Error al obtener citas por usuario:', error);
    res.status(500).json({ 
      error: 'Error al obtener las citas del usuario',
      detalles: error.message 
    });
  }
};

// Obtener citas por propiedad
exports.obtenerCitasPorPropiedad = async (req, res) => {
  try {
    const { propiedad_id } = req.params;

    const citas = await Cita.findAll({
      where: { propiedad_id },
      include: [
        { 
          model: Usuario, 
          as: 'usuario',
          attributes: ['uid', 'nombre', 'email', 'telefono'] 
        }
      ],
      order: [['fecha', 'ASC'], ['hora', 'ASC']]
    });

    if (!citas || citas.length === 0) {
      return res.status(404).json({ 
        mensaje: 'No se encontraron citas para esta propiedad' 
      });
    }

    res.json(citas);
  } catch (error) {
    console.error('Error al obtener citas por propiedad:', error);
    res.status(500).json({ 
      error: 'Error al obtener las citas de la propiedad',
      detalles: error.message 
    });
  }
};

// Eliminar una cita
exports.eliminarCita = async (req, res) => {
  try {
    const { id } = req.params;

    const cita = await Cita.findByPk(id);
    if (!cita) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }

    await cita.destroy();
    res.json({ mensaje: 'Cita eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar cita:', error);
    res.status(500).json({ 
      error: 'Error al eliminar la cita',
      detalles: error.message 
    });
  }
};