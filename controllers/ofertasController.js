// controllers/ofertaController.js
const { Oferta, Propiedad, Usuario } = require('../models');

module.exports = {
  // Crear una nueva oferta (requiere mensaje)
  async crearOferta(req, res) {
    try {
      const { usuario_uid, propiedad_id, precio_ofrecido, mensaje } = req.body;
      
      // Validación: mensaje obligatorio
      if (!mensaje || mensaje.trim() === '') {
        return res
          .status(400)
          .json({ error: 'El mensaje es obligatorio al crear una oferta.' });
      }
      
      // (Opcional) verificar que la propiedad exista:
      const propiedad = await Propiedad.findByPk(propiedad_id);
      if (!propiedad) {
        return res.status(404).json({ error: 'Propiedad no encontrada.' });
      }
      
      const nuevaOferta = await Oferta.create({
        usuario_uid,
        propiedad_id,
        precio_ofrecido,
        mensaje,
        estado: 'pendiente'
      });
      
      res.status(201).json({
        mensaje: 'Oferta creada con éxito',
        data: nuevaOferta
      });
    } catch (error) {
      console.error('Error al crear oferta:', error);
      res.status(500).json({ error: 'Error interno al crear oferta.' });
    }
  },
  
  // Aceptar oferta
  async aceptarOferta(req, res) {
    try {
      const { oferta_id } = req.params;
      const oferta = await Oferta.findByPk(oferta_id);
      if (!oferta) {
        return res.status(404).json({ error: 'Oferta no encontrada.' });
      }
      
      oferta.estado = 'aceptada';
      await oferta.save();
      
      res.json({ mensaje: 'Oferta aceptada', data: oferta });
    } catch (error) {
      console.error('Error al aceptar oferta:', error);
      res.status(500).json({ error: 'Error interno al aceptar oferta.' });
    }
  },
  
  // Rechazar oferta
  async rechazarOferta(req, res) {
    try {
      const { oferta_id } = req.params;
      const oferta = await Oferta.findByPk(oferta_id);
      if (!oferta) {
        return res.status(404).json({ error: 'Oferta no encontrada.' });
      }
      
      oferta.estado = 'rechazada';
      await oferta.save();
      
      res.json({ mensaje: 'Oferta rechazada', data: oferta });
    } catch (error) {
      console.error('Error al rechazar oferta:', error);
      res.status(500).json({ error: 'Error interno al rechazar oferta.' });
    }
  },
  
  // Crear contrapropuesta
  async crearContrapropuesta(req, res) {
    try {
      const { oferta_id } = req.params;
      const { precio_ofrecido, mensaje } = req.body;
      
      if (!mensaje || mensaje.trim() === '') {
        return res
          .status(400)
          .json({ error: 'El mensaje es obligatorio al crear una contrapropuesta.' });
      }
      
      const ofertaOriginal = await Oferta.findByPk(oferta_id);
      if (!ofertaOriginal) {
        return res.status(404).json({ error: 'Oferta no encontrada.' });
      }
      
      // Marcar la oferta original como contrapropuesta
      ofertaOriginal.estado = 'contrapropuesta';
      await ofertaOriginal.save();
      
      // Crear una nueva oferta que es contrapropuesta
      const contrapropuesta = await Oferta.create({
        usuario_uid: req.body.usuario_uid || ofertaOriginal.usuario_uid,
        propiedad_id: ofertaOriginal.propiedad_id,
        precio_ofrecido,
        mensaje,
        estado: 'pendiente',
        oferta_padre_id: oferta_id
      });
      
      res.json({ 
        mensaje: 'Contrapropuesta creada', 
        data: contrapropuesta 
      });
    } catch (error) {
      console.error('Error al crear contrapropuesta:', error);
      res.status(500).json({ error: 'Error interno al crear contrapropuesta.' });
    }
  },
  
  // Eliminar oferta
  async eliminarOferta(req, res) {
    try {
      const { oferta_id } = req.params;
      const oferta = await Oferta.findByPk(oferta_id);
      if (!oferta) {
        return res.status(404).json({ error: 'Oferta no encontrada.' });
      }
      
      await oferta.destroy();
      res.json({ mensaje: 'Oferta eliminada con éxito' });
    } catch (error) {
      console.error('Error al eliminar oferta:', error);
      res.status(500).json({ error: 'Error interno al eliminar oferta.' });
    }
  },
  
  // Obtener ofertas de una propiedad
  async obtenerOfertasPorPropiedad(req, res) {
    try {
      const { propiedad_id } = req.params;
      
      const ofertas = await Oferta.findAll({
        where: { propiedad_id },
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['nombre', 'email', 'telefono']
          }
        ]
      });
      
      res.json({ data: ofertas });
    } catch (error) {
      console.error('Error al obtener ofertas por propiedad:', error);
      res.status(500).json({ error: 'Error interno al obtener ofertas.' });
    }
  },
  
  // Obtener ofertas por usuario
  async obtenerOfertasPorUsuario(req, res) {
    try {
      const { usuario_uid } = req.params;
      
      const ofertas = await Oferta.findAll({
        where: { usuario_uid },
        include: [
          {
            model: Propiedad,
            as: 'propiedad'
          }
        ]
      });
      
      res.json({ data: ofertas });
    } catch (error) {
      console.error('Error al obtener ofertas por usuario:', error);
      res.status(500).json({ error: 'Error interno al obtener ofertas.' });
    }
  },

  // Obtener todas las ofertas
  async TodasLasOfertas(req, res) {
    try {
      const ofertas = await Oferta.findAll({
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['nombre', 'email', 'telefono']
          },
          {
            model: Propiedad,
            as: 'propiedad'
          }
        ]
      });

      res.json({ data: ofertas });
    } catch (error) {
      console.error('Error al obtener todas las ofertas:', error);
      res.status(500).json({ error: 'Error interno al obtener todas las ofertas.' });
    }
  }
};
