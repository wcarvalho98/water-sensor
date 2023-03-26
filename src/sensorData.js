const axios = require('axios');
const Sensor = require('./models/sensorModel');

const createSensores = async () => {
  const numSensores = await Sensor.countDocuments();
  for (let i = 0; i < 100 - numSensores; i++) {
    const sensor = {
      latitude: Math.random() * 100,
      longitude: Math.random() * 100
    };
    await axios.post('http://localhost:8080/sensor', sensor);
  }
};

const createMedida = async (sensorId) => {
  const medida = {
    temperatura: Math.random() * 100,
    pressao: Math.random() * 1000,
    acidez: Math.random() * 14,
    latitude: Math.random() * 100,
    longitude: Math.random() * 100
  };

  await axios.post(`http://localhost:8080/sensor/${sensorId}/medida`, medida);
};

const startSensores = async () => {
  await createSensores();
  const response = await axios.get('http://localhost:8080/sensor');
  response.data.forEach(sensorId => {
    setInterval(async () => {
      await createMedida(sensorId);
    }, 10000);
  })
};

module.exports = startSensores;