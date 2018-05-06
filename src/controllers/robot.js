const express = require('express');
const db = require('../config/db');
const validator = require('validator');

const Robot = db.sequelize.import('../models/robot');
const router = express.Router();

router.post('/', (req, res) => {
  const { numberSeries, name } = req.body;
  const reg = new RegExp('[a-z]{5}d{3}$');
  const numberLenght = validator.isLength(numberSeries, { min: 8, max: 8 });
  const numberValid = reg.test(numberSeries);

  if (numberValid && numberLenght) {
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
    res.status(400).json({
      error: true,
      data: [],
      type: 'Número de série inválido.',
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
  Robot.findOne({ where: { numberSeries } })
    .then(result => res.status(200).json({
      error: false,
      data: result,
    }))
    .catch(error => res.status(404).json({
      error: true,
      type: error,
    }));
});

module.exports = router;
