const { Usuario } = require('../models');
const { admin } = require('../config/firebaseAdmin');

// GET: Obtener todos los usuarios
const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

// GET: Obtener un usuario por UID
const getUsuarioPorUid = async (req, res) => {
  try {
    const { uid } = req.params;
    const usuario = await Usuario.findOne({ where: { uid } });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario por UID:', error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};


// POST: Crear usuario con datos de Firebase cuando arrendador es false
const createUsuario = async (req, res) => {
  try {
    // 1. Obtener el token de la cabecera
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

    // 2. Decodificar el token con Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Decoded token:", decodedToken);

    // 3. Extraer uid usando las propiedades disponibles
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
    const existeUsuario = await Usuario.findOne({ where: { uid } });
    if (existeUsuario) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // 6. Crear el registro en la base de datos
    const nuevoUsuario = await Usuario.create({
      uid,
      nombre,
      email,
      // Asegúrate de que el campo en el modelo Usuario coincida, por ejemplo:
      fotoPerfil: photoURL
    });

    return res.status(201).json({
      message: 'Registro como usuario exitoso',
      usuario: nuevoUsuario
    });
  } catch (error) {
    console.error('Error en createUsuario:', error);
    return res.status(500).json({ error: error.message || 'Error al registrar usuario' });
  }
};

// DELETE: Eliminar un usuario por ID
const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await usuario.destroy();
    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};

module.exports = {
  getUsuarios,
  createUsuario,
  deleteUsuario,
  getUsuarioPorUid
};
