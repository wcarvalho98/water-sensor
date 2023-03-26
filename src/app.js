const express = require('express');
const sensorRoutes = require('./routes/sensor');
const startSensores = require('./sensorData');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use('/sensor', sensorRoutes);

app.listen(port, () => console.log(`Servidor iniciado na porta ${port}`));

startSensores();