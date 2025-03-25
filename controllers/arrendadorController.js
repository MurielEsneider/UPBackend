const { Arrendador } = require('../models');
const { admin } = require('../config/firebaseAdmin');

// GET: Obtener todos los arrendadores
const getArrendadores = async (req, res) => {
  try {
    const arrendadores = await Arrendador.findAll();
    res.status(200).json(arrendadores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los arrendadores' });
  }
};

// POST: Crear arrendador con datos de Firebase
const createArrendador = async (req, res) => {
  try {
    // 1. Obtener el token de la cabecera
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

    // 2. Decodificar el token con Firebase Admin y loguear su contenido
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Decoded token:", decodedToken);

    // 3. Extraer uid usando diferentes propiedades
    const uid = decodedToken.uid || decodedToken.sub || decodedToken.user_id;
    if (!uid) {
      console.error("No se encontró uid en el token:", decodedToken);
      return res.status(400).json({ error: 'El token no contiene uid' });
    }
    console.log("UID obtenido:", uid);

    // 4. Extraer el resto de la información
    const { displayName, email, photoURL } = decodedToken;
    const nombre = displayName || "Nombre no proporcionado";

    // 5. Verificar si el usuario ya existe en la base de datos
    const existeArrendador = await Arrendador.findOne({ where: { uid } });
    if (existeArrendador) {
      return res.status(400).json({ error: 'El usuario ya es arrendador' });
    }

    // 6. Crear el registro en la base de datos
    const nuevoArrendador = await Arrendador.create({
      uid,
      nombre,
      email,
      fotoPerfil: photoURL
    });

    return res.status(201).json({
      message: 'Registro como arrendador exitoso',
      arrendador: nuevoArrendador
    });
  } catch (error) {
    console.error('Error en createArrendador:', error);
    return res.status(500).json({ error: error.message || 'Error al registrar arrendador' });
  }
};

// DELETE: Eliminar un arrendador por ID
const deleteArrendador = async (req, res) => {
  try {
    const { id } = req.params;

    const arrendador = await Arrendador.findByPk(id);
    if (!arrendador) {
      return res.status(404).json({ error: 'Arrendador no encontrado' });
    }

    await arrendador.destroy();
    res.status(200).json({ message: 'Arrendador eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el arrendador' });
  }
};

module.exports = {
  getArrendadores,
  createArrendador,
  deleteArrendador
};
