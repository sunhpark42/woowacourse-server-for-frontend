const express = require('express');

const router = express.Router();

const CartAPI = require('./api/cart');
const ProductAPI = require('./api/products');

router.use(`/cart`, CartAPI);
router.use(`/products`, ProductAPI);

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

module.exports = router;
