'use strict';
const { Propiedad } = require('../models');
const upload = require('../config/upload'); // Importamos la configuración de Multer


// GET: Obtener propiedades
const obtenerPropiedades = async (req, res) => {
  try {
    // Extraemos y limpiamos el query parameter "propietario_id"
    const propietario_id = req.query.propietario_id ? req.query.propietario_id.trim() : null;
    let propiedades;
    if (propietario_id) {
      // Si se proporciona, filtramos las propiedades que tengan ese propietario_id
      propiedades = await Propiedad.findAll({ where: { propietario_id } });
    } else {
      // Si no se especifica, se devuelven todas las propiedades
      propiedades = await Propiedad.findAll();
    }
    res.status(200).json(propiedades);
  } catch (error) {
    console.error("Error al obtener propiedades:", error);
    res.status(500).json({ error: "Error al obtener las propiedades" });
  }
};

// POST: Crear propiedad
const crearPropiedad = (req, res) => {
  // Ejecutamos el middleware de Multer para procesar el archivo con la clave "imagen"
  upload.single("imagen")(req, res, async (err) => {
    if (err) {
      // Si ocurre un error en la subida del archivo, devolvemos el error
      return res.status(400).json({ error: err.message });
    }
    try {
      // Extraemos los campos enviados en el cuerpo de la petición
      const { titulo, descripcion, direccion, precio, propietario_id } = req.body;
      
      // Si no se ha subido un archivo, retornamos un error
      if (!req.file) {
        return res.status(400).json({ error: "Se requiere una imagen" });
      }

      // Creamos la propiedad en la base de datos
      const nuevaPropiedad = await Propiedad.create({
        titulo,
        descripcion,
        direccion,
        precio,
        imagen: req.file.filename, // Se guarda el nombre del archivo generado por Multer
        propietario_id  // Se asume que este valor es el UID del propietario (tipo STRING) o el id según tu configuración
      });

      // Retornamos respuesta exitosa con el id de la nueva propiedad
      return res.status(201).json({
        message: "Propiedad creada exitosamente",
        id: nuevaPropiedad.id
      });
    } catch (error) {
      console.error("Error al crear la propiedad:", error);
      return res.status(500).json({ error: error.message || "Error al crear la propiedad" });
    }
    
  });
};



// PUT: Editar propiedad
const editarPropiedad = (req, res) => {
  // Usamos Multer para procesar el archivo (si se envía uno nuevo)
  upload.single("imagen")(req, res, async (err) => {
    if (err) {
      // Si ocurre un error en la subida del archivo, devolvemos el error
      return res.status(400).json({ error: err.message });
    }
    try {
      const { id } = req.params; // ID de la propiedad a editar
      // Extraemos los campos enviados en el cuerpo de la petición
      const { titulo, descripcion, direccion, precio, propietario_id } = req.body;
      
      // Buscamos la propiedad en la base de datos
      const propiedad = await Propiedad.findByPk(id);
      if (!propiedad) {
        return res.status(404).json({ error: 'Propiedad no encontrada' });
      }
      
      // Si se envía un nuevo archivo, usamos su nombre; de lo contrario, conservamos la imagen actual
      const nuevaImagen = req.file ? req.file.filename : propiedad.imagen;
      
      // Actualizamos la propiedad con los nuevos datos (o mantenemos los anteriores si no se proporcionan)
      const propiedadActualizada = await propiedad.update({
        titulo: titulo || propiedad.titulo,
        descripcion: descripcion || propiedad.descripcion,
        direccion: direccion || propiedad.direccion,
        precio: precio || propiedad.precio,
        imagen: nuevaImagen,
        // Si se envía un propietario_id, lo actualizamos; de lo contrario, se conserva el actual
        propietario_id: propietario_id || propiedad.propietario_id
      });
      
      return res.status(200).json({
        message: "Propiedad actualizada exitosamente",
        propiedad: propiedadActualizada
      });
    } catch (error) {
      console.error("Error al editar la propiedad:", error);
      return res.status(500).json({ error: error.message || "Error al editar la propiedad" });
    }
  });
};

// DELETE: Eliminar propiedad por id
const eliminarPropiedad = async (req, res) => {
  try {
    const { id } = req.params;
    // Buscamos la propiedad por su id
    const propiedad = await Propiedad.findByPk(id);
    if (!propiedad) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }
    // Eliminamos la propiedad
    await propiedad.destroy();
    res.status(200).json({ message: 'Propiedad eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la propiedad' });
  }
};

module.exports = {
  crearPropiedad,
  obtenerPropiedades,
  eliminarPropiedad
};
