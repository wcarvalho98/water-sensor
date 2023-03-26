const express = require('express');
const router = express.Router();

const sensorController = require('../controllers/sensorController');

router.get('/', sensorController.getSensorsId);
router.post('/', sensorController.createSensor);

router.post('/:id/medida', sensorController.createMedida);
router.get('/:id/medida', sensorController.getMedidas);

router.get('/:id/status', sensorController.getStatusFromSensor);
router.get('/status', sensorController.getStatusFromAllSensors);

module.exports = router;