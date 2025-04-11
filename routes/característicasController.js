// routes/caracteristicasRoutes.js
const express = require('express');
const router = express.Router();
const caracteristicasController = require('../controllers/característicasController');

router.post('/caracteristicas', caracteristicasController.createCaracteristica);
router.get('/caracteristicas/buscar', caracteristicasController.buscarAlojamientoPorCaracteristicas);

module.exports = router;
