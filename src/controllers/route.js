const express = require('express');
const db = require('../config/db');
const moment = require('moment');

const Route = db.sequelize.import('../models/route');
const Robot = db.sequelize.import('../models/robot');
const router = express.Router();

router.post('/:numberSeries', async (req, res) => {
  const { numberSeries } = req.params;
  const {
    name, type, start,
  } = req.body;

  const date = moment(start, 'DD/MM/YYYY').utc();

  const robot = await Robot.findOne({ where: { numberSeries } });
  const route = Route.build({
    name, type, start: date,
  });
  route.setRobot(robot);

  route.save()
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

router.get('/:numberSeries', async (req, res) => {
  const { numberSeries } = req.params;

  const robot = await Robot.findOne({ where: { numberSeries } });

  Route.findAll({
    where: { robotId: robot.id, active: true },
    order: [['createdAt', 'ASC']],
  })
    .then(result => res.status(200).json({
      error: false,
      data: { routes: result, robot },
    }))
    .catch(error => res.status(404).json({
      error: true,
      type: error,
    }));
});

router.put('/:idRoute', async (req, res) => {
  const { idRoute } = req.params;
  const { start } = req.body;

  const date = moment(start, 'DD/MM/YYYY').utc();

  Route.update({ start: date }, { where: { id: idRoute } })
    .then(result => res.status(200).json({
      error: false,
      data: { result },
    }))
    .catch(error => res.status(404).json({
      error: true,
      type: error,
    }));
});

router.delete('/:idRoute', async (req, res) => {
  const { idRoute } = req.params;

  Route.update({ active: false }, { where: { id: idRoute } })
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
