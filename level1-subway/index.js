const express = require('express');
const router = express.Router();

const MemberAPI = require('./api/members');
const StationsAPI = require('./api/stations');
const LinesAPI = require('./api/lines');
const SectionsAPI = require('./api/sections');

router.use(`/members`, MemberAPI);
router.use(`/stations`, StationsAPI);
router.use(`/lines`, LinesAPI);
router.use(`/sections`, SectionsAPI);

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

module.exports = router;
