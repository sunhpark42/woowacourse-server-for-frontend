const express = require('express');

const swaggerUI = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const router = express.Router();

const CartAPI = require('./api/cart');
const ProductAPI = require('./api/products');

router.use(`/cart`, CartAPI);
router.use(`/products`, ProductAPI);

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

const options = {
  swaggerDefinition: {
    info: {
      title: 'API Docs',
      version: '1.0.0',
      description: 'API Docs',
    },
    host: 'localhost:5000/level2/cart',
    basePath: '/docs',
  },
  apis: ['/level2-cart/api/*.js'],
};

const specs = swaggerJsdoc(options);

router.use('/docs', swaggerUI.serve, swaggerUI.setup(specs));

module.exports = router;
