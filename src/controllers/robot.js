const express = require('express');
const db = require('../config/db');

const Robot = db.sequelize.import('../models/robot');
const router = express.Router();

router.post('/', (req, res) => {
  const { numberSeries, name } = req.body;
  Robot.create({ numberSeries, name })
    .then(result => res.status(201).json({
      error: false,
      data: result,
    }))
    .catch(error => res.json({
      error: true,
      data: [],
      type: error,
    }));
});

router.get('/:numberSeries', (req, res) => {
  const { numberSeries } = req.params;
  Robot.findOne({ where: { numberSeries } })
    .then(result => res.status(201).json({
      error: false,
      data: result,
    }))
    .catch(error => res.json({
      error: true,
      type: error,
    }));
});

module.exports = router;
