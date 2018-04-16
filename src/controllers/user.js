const express = require('express');
const db = require('../config/db');

const User = db.sequelize.import('../models/user');
const Robot = db.sequelize.import('../models/robot');
const router = express.Router();

router.post('/:numberSeries', async (req, res) => {
  const { numberSeries } = req.params;
  const {
    name, email, service, serviceId,
  } = req.body;

  const robot = await Robot.findOne({ where: { numberSeries } });
  const user = User.build({
    name, email, service, serviceId,
  });
  user.setRobot(robot);

  user.save()
    .then(result => res.status(201).json({
      error: false,
      data: result,
    }))
    .catch(error => res.status(501).json({
      error: true,
      data: [],
      type: error,
    }));
});

router.get('/:serviceId', async (req, res) => {
  const { serviceId } = req.params;

  User.findOne({
    where: { serviceId },
    include: [
      { model: Robot, required: true },
    ],
  })
    .then(result => res.status(200).json({
      error: false,
      data: { result },
    }))
    .catch(error => res.status(404).json({
      error: true,
      type: error,
    }));
});

module.exports = router;
