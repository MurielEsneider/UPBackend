const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoritosCrontoller');

// Obtener favoritos de un usuario
router.get('/favorites/:usuarioUid', favoriteController.obtenerFavoritos);

// Agregar favorito
router.post('/favorites', favoriteController.agregarFavorito);

// Eliminar favorito
router.delete('/favorites/:usuarioUid/:propiedadId', favoriteController.eliminarFavorito);

module.exports = router;
