'use strict';
const { Propiedad } = require('../models');
const upload = require('../config/upload'); // Importamos la configuración de Multer

// GET: Obtener propiedades
const obtenerPropiedades = async (req, res) => {
  try {
    // Extraemos y limpiamos el query parameter "arrendador_uid"
    const arrendador_uid = req.body.arrendador_uid ? req.body.arrendador_uid.trim() : null;
    let propiedades;
    if (arrendador_uid) {
      // Si se proporciona, filtramos las propiedades que tengan ese arrendador_uid
      propiedades = await Propiedad.findAll({ where: { arrendador_uid } });
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

// GET: Obtener propiedad por ID
const obtenerPropiedadId = async (req, res) => {
  try {
    const { id } = req.params;
    // Buscamos en la base de datos la propiedad con el ID especificado
    const propiedad = await Propiedad.findByPk(id);

    // Si no se encuentra la propiedad, devolvemos un 404
    if (!propiedad) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    // Retornamos la propiedad como JSON
    return res.json(propiedad);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno del servidor' });
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
      // Soportamos ambos nombres de campo: arrendador_uid y propietario_uid
      const { titulo, descripcion, direccion, precio, arrendador_uid, propietario_uid } = req.body;
      const uid = arrendador_uid || propietario_uid;
      
      if (!uid) {
        return res.status(400).json({ error: "Se requiere el UID del arrendador" });
      }
      
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
        arrendador_uid: uid // Asignamos el UID obtenido
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
  // Procesamos con Multer para manejar el archivo (campo "imagen")
  upload.single("imagen")(req, res, async (err) => {
    if (err) {
      // Si ocurre un error en la subida del archivo, se devuelve un error
      return res.status(400).json({ error: err.message });
    }
    try {
      // Obtenemos el id de la propiedad a editar desde req.params
      const { id } = req.params;
      // Buscamos la propiedad en la base de datos
      const propiedad = await Propiedad.findByPk(id);
      if (!propiedad) {
        return res.status(404).json({ error: 'Propiedad no encontrada' });
      }
      
      // Extraemos los campos enviados en el cuerpo de la petición
      // Soportamos ambos nombres de campo para el UID
      const { titulo, descripcion, direccion, precio, arrendador_uid, propietario_uid } = req.body;
      const uid = arrendador_uid || propietario_uid || propiedad.arrendador_uid;
      
      // Si se envía un nuevo archivo, usamos su nombre; si no, conservamos la imagen actual
      const nuevaImagen = req.file ? req.file.filename : propiedad.imagen;
      
      // Actualizamos la propiedad con los nuevos datos (o dejamos los anteriores si no se proporcionan)
      const propiedadActualizada = await propiedad.update({
        titulo: titulo || propiedad.titulo,
        descripcion: descripcion || propiedad.descripcion,
        direccion: direccion || propiedad.direccion,
        precio: precio || propiedad.precio,
        imagen: nuevaImagen,
        arrendador_uid: uid
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
  obtenerPropiedadId,
  obtenerPropiedades,
  editarPropiedad,
  eliminarPropiedad
};
