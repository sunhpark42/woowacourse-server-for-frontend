const express = require('express');
const router = express.Router();

const { default: APPLICATION_CODE } = require('../constants/applicationCode');

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

/**
 * @swagger
 *  /carts:
 *    get:
 *      tags:
 *      - 장바구니 관리 API
 *      description: 장바구니 관리 API
 *      produces:
 *      - application/json
 *      responses:
 *       200:
 *        description: 장바구니 관리 API
 *        schema:
 *          type: array,
 *          example: [
 *            {
 *              id: 1,
 *            }
 *          ]
 */

module.exports = router;
