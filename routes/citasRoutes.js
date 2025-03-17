const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citasController');

router.get('/citas', citaController.getAllCitas);
router.get('/citas/:id', citaController.getCitaById);
router.post('/citas', citaController.createCita);
router.put('/citas/:id', citaController.updateCita);
router.delete('/citas/:id', citaController.deleteCita);

module.exports = router;
