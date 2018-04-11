const express = require('express');
const db = require('../config/db');
const moment = require('moment');

const Work = db.sequelize.import('../models/work');
const Route = db.sequelize.import('../models/route');
const router = express.Router();

router.post('/:idRoute', async (req, res) => {
  const { idRoute } = req.params;
  const {
    temperature, humidity, startWork, endWork,
  } = req.body;

  const initDate = moment(startWork, 'DD/MM/YYYY hh:mm:ss').utc();
  const endDate = moment(endWork, 'DD/MM/YYYY hh:mm:ss').utc();

  const route = await Route.findById(idRoute);
  const work = Work.build({
    temperature,
    humidity,
    startWork: initDate,
    endWork: endDate,
  });
  work.setRobot(route);

  work.save()
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

router.get('/:idRoute', async (req, res) => {
  const { idRoute } = req.params;

  const route = await Route.findById(idRoute);

  Work.findAll({
    where: { routeId: route.id },
    order: [['createdAt', 'DESC']],
  })
    .then(result => res.status(201).json({
      error: false,
      data: { works: result, route },
    }))
    .catch(error => res.status(404).json({
      error: true,
      type: error,
    }));
});

module.exports = router;
