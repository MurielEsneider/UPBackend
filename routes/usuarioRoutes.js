const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario');

router.get('/usuario', usuarioController.getUsuarios);
router.post('/usuario', usuarioController.createUsuario);
router.delete('/usuario/:id', usuarioController.deleteUsuario);
router.get('/usuario/:uid', usuarioController.getUsuarioPorUid);

module.exports = router;
