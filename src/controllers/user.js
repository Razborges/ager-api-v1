const express = require('express');
const db = require('../config/db');
const validator = require('validator');

const User = db.sequelize.import('../models/user');
const Robot = db.sequelize.import('../models/robot');
const router = express.Router();

const { regex } = require('../config/regex');

router.post('/:numberSeries', async (req, res) => {
  const { numberSeries } = req.params;
  const {
    name, email, service, serviceId,
  } = req.body;

  const numberLength = validator.isLength(numberSeries, { min: 8, max: 8 });
  const numberValid = regex.test(numberSeries);
  const nameValid = validator.isEmpty(name);
  const emailValid = validator.isEmail(email);
  const serviceValid = validator.isEmpty(service);
  const serviceIdValid = validator.isEmpty(serviceId);

  if (numberValid && numberLength && !nameValid && emailValid && !serviceValid && !serviceIdValid) {
    const robot = await Robot.findOne({ where: { numberSeries } });

    if (!robot) {
      res.status(404).json({
        error: true,
        data: [],
      });
    }

    if (robot) {
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
    }
  } else {
    const error1 = nameValid ? 'Obrigatório preenchimento do nome.' : '';
    const error2 = !numberValid || !numberLength ? 'Número de série inválido.' : '';
    const error3 = !emailValid ? 'Utilize um e-mail válido.' : '';
    const error4 = serviceValid ? 'Obrigatório o preenchimento do nome do serviço.' : '';
    const error5 = serviceIdValid ? 'Obrigatório o preenchimento do id do serviço.' : '';

    res.status(400).json({
      error: true,
      data: [],
      type: `${error1} ${error2} ${error3} ${error4} ${error5}`,
    });
  }
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
