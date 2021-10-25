const express = require('express');
const router = express.Router();

const { default: APPLICATION_CODE } = require('../constants/applicationCode');

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

module.exports = router;
