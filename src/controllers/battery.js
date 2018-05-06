const express = require('express');
const db = require('../config/db');
const validator = require('validator');

const Battery = db.sequelize.import('../models/battery');
const Robot = db.sequelize.import('../models/robot');
const router = express.Router();

const { regex } = require('../config/regex');

router.post('/:numberSeries', async (req, res) => {
  const { numberSeries } = req.params;
  const { level } = req.body;

  const numberLength = validator.isLength(numberSeries, { min: 8, max: 8 });
  const numberValid = regex.test(numberSeries);
  const levelValid = validator.isInt(level);
  const withLevel = validator.isEmpty(level);

  if (numberValid && numberLength && levelValid && !withLevel) {
    const robot = await Robot.findOne({ where: { numberSeries } });

    if (!robot) {
      res.status(404).json({
        error: true,
        data: [],
      });
    }

    if (robot) {
      const battery = Battery.build({ level });
      battery.setRobot(robot);

      battery.save()
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
    const error1 = !levelValid || withLevel ? 'Obrigatório preenchimento do nível com um número inteiro.' : '';
    const error2 = !numberValid || !numberLength ? 'Número de série inválido.' : '';

    res.status(400).json({
      error: true,
      data: [],
      type: `${error1}${error2}`,
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
      Battery.findAll({ where: { robotId: robot.id }, order: [['createdAt', 'DESC']] })
        .then(result => res.status(200).json({
          error: false,
          data: { battery: result, robot },
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

module.exports = router;
