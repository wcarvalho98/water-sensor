const mongoose = require('../config/database');

const sensorSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  avgNormalized: Number,
  medidas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medida'
  }]
});

const Sensor = mongoose.model('Sensor', sensorSchema);

module.exports = Sensor;