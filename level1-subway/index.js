const express = require('express');
const router = express.Router();

const StationsAPI = require('./api/stations');
const MemberAPI = require('./api/members');

router.use(`/stations`, StationsAPI);
router.use(`/members`, MemberAPI);

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

module.exports = router;
