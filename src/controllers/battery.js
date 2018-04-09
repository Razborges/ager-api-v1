const express = require('express');
const db = require('../config/db');

const Battery = db.sequelize.import('../models/battery');
const Robot = db.sequelize.import('../models/robot');
const router = express.Router();

router.post('/:numberSeries', async (req, res) => {
  const { numberSeries } = req.params;
  const { level } = req.body;

  const robot = await Robot.findOne({ where: { numberSeries } });

  // Battery.create({ level, robotId: robot.id })
  Battery.create({ level }).setRobot(robot)
    .then(result => res.status(201).json({
      error: false,
      data: result,
    }))
    .catch(error => res.status(404).json({
      error: true,
      data: [],
      type: error,
    }));
});

router.get('/:numberSeries', async (req, res) => {
  const { numberSeries } = req.params;
  const robot = await Robot.findOne({ where: { numberSeries } });

  Battery.findAll({ where: { robotId: robot.id }, order: 'createdAt DESC' })
    .then(result => res.status(201).json({
      error: false,
      data: { battery: result, robot },
    }))
    .catch(error => res.status(404).json({
      error: true,
      type: error,
    }));
});

module.exports = router;
