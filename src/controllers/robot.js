const express = require('express');
const db = require('../config/db');
const validator = require('validator');

const Robot = db.sequelize.import('../models/robot');
const router = express.Router();

const { regex } = require('../config/regex');

router.post('/', (req, res) => {
  const { numberSeries, name } = req.body;

  const numberLength = validator.isLength(numberSeries, { min: 8, max: 8 });
  const numberValid = regex.test(numberSeries);
  const nameValid = validator.isEmpty(name);

  if (numberValid && numberLength && !nameValid) {
    Robot.create({ numberSeries, name })
      .then(result => res.status(201).json({
        error: false,
        data: result,
      }))
      .catch(error => res.status(501).json({
        error: true,
        data: [],
        type: error,
      }));
  } else {
    const error1 = nameValid ? 'Obrigatório preenchimento do nome.' : '';
    const error2 = !numberValid || !numberLength ? 'Número de série inválido.' : '';

    res.status(400).json({
      error: true,
      data: [],
      type: `${error1} ${error2}`,
    });
  }
});

router.get('/', (req, res) => {
  Robot.findAndCountAll()
    .then(result => res.status(200).json({
      error: false,
      data: result,
    }))
    .catch(error => res.status(404).json({
      error: true,
      type: error,
    }));
});

router.get('/:numberSeries', (req, res) => {
  const { numberSeries } = req.params;

  const numberLength = validator.isLength(numberSeries, { min: 8, max: 8 });
  const numberValid = regex.test(numberSeries);

  if (numberValid && numberLength) {
    Robot.findOne({ where: { numberSeries } })
      .then(result => res.status(200).json({
        error: false,
        data: result,
      }))
      .catch(error => res.status(404).json({
        error: true,
        type: error,
      }));
  } else {
    res.status(400).json({
      error: true,
      data: [],
      type: 'Número de série inválido.',
    });
  }
});

module.exports = router;
