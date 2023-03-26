const mongoose = require('../config/database');

const measurementSchema = new mongoose.Schema({
  temperatura: Number,
  pressao: Number,
  acidez: Number,
  latitude: Number,
  longitude: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Measurement = mongoose.model('Medida', measurementSchema);

module.exports = Measurement;