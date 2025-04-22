const { Cita, Usuario, Propiedad } = require('../models');

// Crear una nueva cita
exports.crearCita = async (req, res) => {
  try {
    const { usuario_uid, propiedad_id, fecha, hora } = req.body;

    if (!usuario_uid || !propiedad_id || !fecha || !hora) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const usuario = await Usuario.findByPk(usuario_uid);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const propiedad = await Propiedad.findByPk(propiedad_id);
    if (!propiedad) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }

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
          attributes: ['id', 'titulo']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const citasFormateadas = citas.map(cita => ({
      cita_id: cita.cita_id,
      usuario: cita.usuario,
      propiedad: cita.propiedad,
      fecha: cita.fecha,
      hora: cita.hora,
      estado: cita.estado,
      creado: cita.createdAt
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
    const { cita_id } = req.params;

    const cita = await Cita.findByPk(cita_id, {
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: { exclude: ['password'] }
        },
        {
          model: Propiedad,
          as: 'propiedad',
          attributes: ['id', 'titulo', 'descripcion']
        }
      ]
    });

    if (!cita) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }

    res.json({
      cita_id: cita.cita_id,
      usuario: cita.usuario,
      propiedad: cita.propiedad,
      fecha: cita.fecha,
      hora: cita.hora,
      estado: cita.estado,
      creado: cita.createdAt
    });
  } catch (error) {
    console.error('Error al obtener cita:', error);
    res.status(500).json({
      error: 'Error al obtener la cita',
      detalles: error.message
    });
  }
};

// Obtener citas por usuario - CORREGIDO
exports.obtenerCitasPorUsuario = async (req, res) => {
  try {
    const { usuario_uid } = req.params;
    
    // Verificar que el UID del usuario exista
    if (!usuario_uid) {
      return res.status(400).json({
        error: 'ID de usuario no proporcionado',
        parametros: req.params
      });
    }

    console.log(`Buscando citas para el usuario: ${usuario_uid}`);

    // Buscar el usuario primero para verificar que existe
    const usuario = await Usuario.findByPk(usuario_uid);
    if (!usuario) {
      console.log(`Usuario no encontrado con ID: ${usuario_uid}`);
      // Seguimos adelante aunque el usuario no exista, pero lo registramos
    }

    // Intentar obtener las citas con manejo de errores más detallado
    const citas = await Cita.findAll({
      where: { usuario_uid },
      include: [
        {
          model: Propiedad,
          as: 'propiedad',
          attributes: ['id', 'titulo', 'imagenPrincipal'],
          required: false // Hacemos esta relación opcional para evitar errores si la propiedad no existe
        }
      ],
      order: [['createdAt', 'DESC']] // Cambiamos a createdAt para evitar problemas si fecha no existe
    });

    console.log(`Encontradas ${citas.length} citas para el usuario ${usuario_uid}`);

    // Transformar los datos para el cliente con manejo seguro de valores nulos
    const citasFormateadas = citas.map(c => {
      // Formato para fechas adaptado al frontend
      let fechaFormateada = '';
      try {
        const fecha = new Date(c.fecha);
        fechaFormateada = `${fecha.getDate()} de ${obtenerNombreMes(fecha.getMonth())}`;
      } catch (error) {
        fechaFormateada = 'Fecha no disponible';
        console.error('Error al formatear fecha:', error);
      }

      // Datos del arrendador (propiedad)
      const nombreArrendador = c.propiedad?.titulo || 'Arrendador desconocido';
      
      return {
        cita_id: c.cita_id || `temp-${Math.random().toString(36).substr(2, 9)}`,
        nombreArrendador,
        fecha: fechaFormateada,
        diaCita: formatearFecha(c.fecha),
        horaCita: c.hora || 'Hora no especificada',
        estado: c.estado || 'pendiente',
        usuario_uid: c.usuario_uid,
        propiedad_id: c.propiedad_id
      };
    });

    res.json(citasFormateadas);
  } catch (error) {
    console.error('Error al obtener citas por usuario:', error);
    res.status(500).json({
      error: 'Error al obtener las citas del usuario',
      detalles: error.message,
      stack: error.stack
    });
  }
};

// Obtener citas por propiedad - CORREGIDO
exports.obtenerCitasPorPropiedad = async (req, res) => {
  try {
    const { propiedad_id } = req.params;

    if (!propiedad_id) {
      return res.status(400).json({
        error: 'ID de propiedad no proporcionado'
      });
    }

    // Buscar la propiedad primero para verificar que existe
    const propiedad = await Propiedad.findByPk(propiedad_id);
    if (!propiedad) {
      return res.status(404).json({ 
        error: 'Propiedad no encontrada',
        propiedad_id 
      });
    }

    const citas = await Cita.findAll({
      where: { propiedad_id },
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['uid', 'nombre', 'email', 'telefono'],
          required: false // Hacemos esta relación opcional para evitar errores
        }
      ],
      order: [['createdAt', 'DESC']] // Cambiamos a createdAt para evitar problemas
    });

    // Transformar los datos para el cliente
    const citasFormateadas = citas.map(c => {
      return {
        cita_id: c.cita_id,
        usuario: c.usuario || { nombre: 'Usuario desconocido' },
        fecha: formatearFecha(c.fecha),
        hora: c.hora || 'Hora no especificada',
        estado: c.estado || 'pendiente'
      };
    });

    res.json(citasFormateadas);
  } catch (error) {
    console.error('Error al obtener citas por propiedad:', error);
    res.status(500).json({
      error: 'Error al obtener las citas de la propiedad',
      detalles: error.message
    });
  }
};

// Confirmar una cita - CORREGIDO
exports.aceptarCita = async (req, res) => {
  try {
    const { cita_id } = req.params;

    if (!cita_id) {
      return res.status(400).json({ error: 'ID de cita no proporcionado' });
    }

    const cita = await Cita.findByPk(cita_id);
    if (!cita) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }

    await cita.update({ estado: 'aceptada' }); // Cambiado a 'aceptada' para coincidir con el estado del frontend
    res.json({
      mensaje: 'Cita aceptada exitosamente',
      cita
    });
  } catch (error) {
    console.error('Error al aceptar cita:', error);
    res.status(500).json({
      error: 'Error al aceptar la cita',
      detalles: error.message
    });
  }
};

// Cancelar una cita - CORREGIDO
exports.cancelarCita = async (req, res) => {
  try {
    const { cita_id } = req.params;

    if (!cita_id) {
      return res.status(400).json({ error: 'ID de cita no proporcionado' });
    }

    const cita = await Cita.findByPk(cita_id);
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

// Eliminar una cita - CORREGIDO
exports.eliminarCita = async (req, res) => {
  try {
    const { cita_id } = req.params;

    if (!cita_id) {
      return res.status(400).json({ error: 'ID de cita no proporcionado' });
    }

    const cita = await Cita.findByPk(cita_id);
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

// Funciones auxiliares para formateo de fechas
function obtenerNombreMes(mes) {
  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  return meses[mes] || 'desconocido';
}

function formatearFecha(fechaString) {
  if (!fechaString) return 'Fecha no disponible';
  
  try {
    const fecha = new Date(fechaString);
    if (isNaN(fecha)) return 'Fecha inválida';
    
    return `${fecha.getDate()} de ${obtenerNombreMes(fecha.getMonth())}`;
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Error en fecha';
  }
}