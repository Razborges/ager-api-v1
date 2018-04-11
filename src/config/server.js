const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/robot', require('../controllers/robot'));
app.use('/battery', require('../controllers/battery'));
app.use('/user', require('../controllers/user'));
app.use('/route', require('../controllers/route'));

module.exports = app;
