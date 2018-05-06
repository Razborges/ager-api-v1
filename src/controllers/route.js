const express = require('express');
const db = require('../config/db');
const moment = require('moment');
const validator = require('validator');

const Route = db.sequelize.import('../models/route');
const Robot = db.sequelize.import('../models/robot');
const router = express.Router();

const { regex } = require('../config/regex');

router.post('/:numberSeries', async (req, res) => {
  const { numberSeries } = req.params;
  const {
    name, type,
  } = req.body;

  let date = null;

  if (req.body.start) {
    const { start } = req.body;
    date = moment(start, 'DD/MM/YYYY').utc();
  }

  const numberLength = validator.isLength(numberSeries, { min: 8, max: 8 });
  const numberValid = regex.test(numberSeries);
  const nameValid = validator.isEmpty(name);
  const typeValid = validator.isEmpty(type);
  const dateValid = date.isValid();

  if (numberValid && numberLength && !nameValid && !typeValid && dateValid) {
    const robot = await Robot.findOne({ where: { numberSeries } });

    if (!robot) {
      res.status(404).json({
        error: true,
        data: [],
      });
    }

    if (robot) {
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
    }
  } else {
    const error1 = nameValid ? 'Obrigatório preenchimento do nome.' : '';
    const error2 = !numberValid || !numberLength ? 'Número de série inválido.' : '';
    const error3 = typeValid ? 'Obrigatório preenchimento do tipo.' : '';
    const error4 = !dateValid ? 'Utilize uma data válida.' : '';

    res.status(400).json({
      error: true,
      data: [],
      type: `${error1}${error2}${error3}${error4}`,
    });
  }
});

router.get('/:numberSeries', async (req, res) => {
  const { numberSeries } = req.params;

  const numberLength = validator.isLength(numberSeries, { min: 8, max: 8 });
  const numberValid = regex.test(numberSeries);

  if (numberValid && numberLength) {
    const robot = await Robot.findOne({ where: { numberSeries } });

    if (!robot) {
      res.status(404).json({
        error: true,
        data: [],
      });
    }

    if (robot) {
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
    }
  } else {
    res.status(400).json({
      error: true,
      data: [],
      type: 'Número de série inválido.',
    });
  }
});

router.put('/:idRoute', async (req, res) => {
  const { idRoute } = req.params;
  const { start } = req.body;

  const date = moment(start, 'DD/MM/YYYY').utc();

  const dateValid = date.isValid();

  if (dateValid) {
    Route.update({ start: date }, { where: { id: idRoute } })
      .then(result => res.status(200).json({
        error: false,
        data: { result },
      }))
      .catch(error => res.status(404).json({
        error: true,
        type: error,
      }));
  } else {
    res.status(400).json({
      error: true,
      data: [],
      type: 'Utilize uma data válida.',
    });
  }
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
