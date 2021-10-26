const express = require('express');
const router = express.Router();

const { Station } = require('../models/Station');

const auth = require('../../middleware/auth');
const { default: APPLICATION_CODE } = require('../constants/applicationCode');

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

/**
 * @swagger
 *  /stations:
 *    get:
 *      tags:
 *      - 역 관리 API
 *      description: 역 전체 조회
 *      produces:
 *      - application/json
 *      responses:
 *       200:
 *        description: 역 전체 조회 성공
 */

// GET Station
router.get(`/`, (req, res) => {
  Station.find((error, stations) => {
    if (error) {
      return res.status(200).json([]);
    }

    res.status(200).json(
      stations.map((station) => ({
        id: Number(station._id),
        name: station.name,
        createdDate: station.createdDate,
        updatedDate: station.updatedDate,
      }))
    );
  });
});

// POST Station
router.post(`/`, auth, (req, res) => {
  const station = new Station({ ...req.body, createdDate: new Date() });

  station.save((error, stationInfo) => {
    if (error) {
      console.error(error);
      return res.status(400).json({ code: APPLICATION_CODE.CREATE_STATION_ERROR, message: '역을 생성할 수 없습니다.' });
    }

    return res.status(200).json({
      id: stationInfo._id,
      name: stationInfo.name,
      createdDate: stationInfo.createdDate,
      updatedDate: stationInfo.updatedDate,
    });
  });
});

router.param('id', function (req, res, next, id) {
  req.id = Number(id);

  next();
});

// Delete Station
router.delete(`/:id`, auth, (req, res) => {
  Station.deleteOne({ _id: Number(req.id) }, (error) => {
    if (error) {
      return res.status(400).json({ message: 'Cannot Delete' });
    }

    return res.status(200).json({ message: 'success' });
  });
});

// PUT STATION
router.put(`/:id`, auth, (req, res) => {
  Station.updateOne({ _id: req.id }, { $set: { name: req.body.name } }, (error, station) => {
    if (error) {
      return res.status(400).json({ message: 'Fail to modify' });
    }

    res.status(200).json({
      id: station._id,
      name: station.name,
      createdDate: station.createdDate,
      updatedDate: station.updatedDate,
    });
  });
});

module.exports = router;
