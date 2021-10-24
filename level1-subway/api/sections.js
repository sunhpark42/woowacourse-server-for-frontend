const express = require('express');
const router = express.Router();

const { Station } = require('../models/Station');
const { Line } = require('../models/Line');

const auth = require('../../middleware/auth');
const { default: APPLICATION_CODE } = require('../constants/applicationCode');

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get(`/`, (req, res) => {
  return res.status(200).json({ message: 'temp' });
});

module.exports = router;
