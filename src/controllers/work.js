const express = require('express');
const db = require('../config/db');
const moment = require('moment');
const validator = require('validator');

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

  const tempValid = validator.isNumeric(temperature);
  const humidValid = validator.isNumeric(humidity);
  const startValid = initDate.isValid();
  const endValid = endDate.isValid();

  if (tempValid && humidValid && startValid && endValid) {
    const route = await Route.findById(idRoute);

    if (!route) {
      res.status(404).json({
        error: true,
        data: [],
      });
    }

    if (route) {
      const work = await Work.build({
        temperature,
        humidity,
        startWork: initDate,
        endWork: endDate,
      });
      work.setRoute(route);

      work.save()
        .then(result => res.status(201).json({
          error: false,
          data: result,
        }))
        .catch(error => res.status(501).json({
          error: true,
          data: [],
          type: error,
        }));
    }
  } else {
    const error1 = !tempValid ? 'Obrigatório preenchimento da temperatura com um valor numérico.' : '';
    const error2 = !humidValid ? 'Obrigatório preenchimento da humidade com um valor numérico.' : '';
    const error3 = !startValid ? 'Utilize uma data válida.' : '';
    const error4 = !endValid ? 'Utilize uma data válida.' : '';

    res.status(400).json({
      error: true,
      data: [],
      type: `${error1} ${error2} ${error3} ${error4}`,
    });
  }
});

router.get('/:idRoute', async (req, res) => {
  const { idRoute } = req.params;

  const route = await Route.findById(idRoute);

  if (!route) {
    res.status(404).json({
      error: true,
      data: [],
    });
  }

  if (route) {
    Work.findAll({
      where: { routeId: route.id },
      order: [['createdAt', 'DESC']],
    })
      .then(result => res.status(200).json({
        error: false,
        data: { works: result, route },
      }))
      .catch(error => res.status(404).json({
        error: true,
        type: error,
      }));
  }
});

module.exports = router;
