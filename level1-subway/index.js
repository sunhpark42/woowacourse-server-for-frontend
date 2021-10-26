const express = require('express');
const router = express.Router();

const LoginAPI = require('./api/login');
const MemberAPI = require('./api/members');
const StationsAPI = require('./api/stations');
const LinesAPI = require('./api/lines');
const SectionsAPI = require('./api/sections');

router.use('/login', LoginAPI);
router.use(`/members`, MemberAPI);
router.use(`/stations`, StationsAPI);
router.use(`/lines`, LinesAPI);
router.use(`/sections`, SectionsAPI);

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

const swaggerUI = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    info: {
      title: 'API Docs',
      version: '1.0.0',
      description: 'API Docs',
    },
    host: 'localhost:5000/level1/subway',
    basePath: '/docs',
  },
  apis: ['./level1-subway/api/*.js', './level1-subway/swagger/*.yml'],
};

const specs = swaggerJsdoc(options);

router.use('/docs', swaggerUI.serve, swaggerUI.setup(specs));

module.exports = router;
