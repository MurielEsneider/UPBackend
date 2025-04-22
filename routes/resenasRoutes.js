const express = require('express');
const router = express.Router();
const resenaController = require('../controllers/resenaController');

router.get('/resenas/propiedad/:propiedad_id', resenaController.getResenasByPropiedad);
router.post('/resenas', resenaController.createResena);
router.get('/resenas/propiedad/:propiedad_id/promedio', resenaController.getPromedioResenas);
router.delete('/resenas/:resena_id', resenaController.deleteResena);

module.exports = router;