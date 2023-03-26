const Joi = require('joi');
const Sensor = require('../models/sensorModel');
const Medida = require('../models/medidaModel');

const sensorSchema = Joi.object({
  latitude: Joi.number().required(),
  longitude: Joi.number().required()
});

const medidaSchema = Joi.object({
  temperatura: Joi.number().required(),
  pressao: Joi.number().required(),
  acidez: Joi.number().required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required()
});

const configuraStats = (medida) => {
  let temperatura = medida.temperatura;
  if (temperatura > 60) {
    temperatura = 60;
  } else if (temperatura < 0) {
    temperatura = 0;
  }

  let pressao = medida.pressao;
  if (pressao > 1050) {
    pressao = 1050;
  } else if (pressao < 950) {
    pressao = 950;
  }

  let acidez = medida.acidez;
  if (acidez > 14) {
    acidez = 14;
  } else if (acidez < 0) {
    acidez = 0;
  }

  return { temperatura, pressao, acidez };
};

const normalizaMedidas = (medidas) => {
  let avgTemperatura = 0;
  let avgPressao = 0;
  let avgAcidez = 0;
  let lenght = 0;

  medidas.forEach(medida => {
    const { temperatura, pressao, acidez } = configuraStats(medida);

    avgTemperatura += temperatura / 60;
    avgPressao += (pressao - 950) / (1050 - 950);
    avgAcidez += acidez / 14;
    lenght++;
  });

  if (lenght > 0) {
    avgTemperatura /= lenght;
    avgPressao /= lenght;
    avgAcidez /= lenght;
  }

  return (avgTemperatura + avgPressao + avgAcidez) / 3;
};

const getStatus = (avgNormalized) => {
  let status = '';
  if (!isNaN(avgNormalized)) {
    if (avgNormalized > 0.9 || avgNormalized < 0.1) {
      status = 'vermelho';
    } else if (avgNormalized > 0.7 || avgNormalized < 0.3) {
      status = 'amarelo';
    } else {
      status = 'verde';
    }
  }
  return status;
};

const getSensorsId = async (req, res) => {
  try {
    const sensores = await Sensor.find({}, { _id: 1 }).exec();
    const ids = sensores.map(sensor => sensor._id);
    res.status(200).send(ids);
  } catch (error) {
    console.error(error);
    res.status(500).send({ mensagem: 'Erro ao resgatar os ids dos sensores do banco.' });
  }
};

const createSensor = async (req, res) => {
  const { error } = sensorSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const numSensores = await Sensor.countDocuments();
  if (numSensores >= 100) {
    return res.status(400).send({ mensagem: 'Número máximo de sensores (100) atingido.' });
  }

  try {
    const novoSensor = new Sensor(req.body);
    await novoSensor.save();
    res.status(201).send({ mensagem: 'Sensor adicionado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ mensagem: 'Erro ao adicionar o sensor no banco.' });
  }
};

const createMedida = async (req, res) => {
  const { error } = medidaSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const sensorId = req.params.id;

  try {
    const sensor = await Sensor.findById(sensorId).populate('medidas').slice('medidas', -14).exec();
    if (!sensor) {
      return res.status(404).send({ mensagem: 'Sensor não encontrado.' });
    }

    const medida = new Medida(req.body);
    const { temperatura, pressao, acidez } = configuraStats(medida);
    medida.temperatura = temperatura;
    medida.pressao = pressao;
    medida.acidez = acidez;
    await medida.save();

    sensor.medidas.push(medida);
    sensor.latitude = req.body.latitude;
    sensor.longitude = req.body.longitude;
    const avgNormalized = normalizaMedidas(sensor.medidas);
    if (!isNaN(avgNormalized)) {
      sensor.avgNormalized = avgNormalized;
    }
    await sensor.save();

    return res.status(201).send({ mensagem: 'Medida adicionada com sucesso.' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ mensagem: 'Erro ao adicionar a medida no banco.' });
  }
};

const getMedidas = async (req, res) => {
  const sensorId = req.params.id;

  try {
    const sensor = await Sensor.findById(sensorId).populate('medidas').slice('medidas', -15).exec();
    if (!sensor) {
      return res.status(404).json({ mensagem: 'Sensor não encontrado.' });
    }

    return res.status(200).json({ medidas: sensor.medidas.sort((a, b) => a.createdAt - b.createdAt) })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: 'Erro ao buscar a linha do tempo do sensor.' });
  }
};

const getStatusFromSensor = async (req, res) => {
  const sensorId = req.params.id;

  try {
    const sensor = await Sensor.findById(sensorId).populate('medidas').slice('medidas', -30).exec();
    if (!sensor) {
      return res.status(404).json({ mensagem: 'Sensor não encontrado' });
    }
    const avgNormalized = sensor.avgNormalized;
    const status = getStatus(avgNormalized);

    return res.status(200).json({ status, avgNormalized });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: 'Erro ao buscar status do sensor.' });
  }
};

const getStatusFromAllSensors = async (req, res) => {
  try {
    const sensores = await Sensor.find().exec();

    let avgNormalized = 0;
    let lenght = 0;
    for (const sensor of sensores) {
      avgNormalized += sensor.avgNormalized;
      lenght++;
    }

    if (lenght > 0) {
      const status = getStatus(avgNormalized / lenght);
      return res.status(200).json({ status, avgNormalized: avgNormalized / lenght });
    }

    return res.status(404).json({ mensagem: 'Ainda não existe medidas para esse sensor.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: 'Erro ao buscar status dos sensores.' });
  }
};

module.exports = { getSensorsId, createSensor, createMedida, getMedidas, getStatusFromSensor, getStatusFromAllSensors };