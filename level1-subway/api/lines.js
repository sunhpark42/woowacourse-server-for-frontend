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

// GET LINES
router.get(`/`, (req, res) => {
  Line.find((error, lines) => {
    if (error) {
      return res.status(200).json([]);
    }

    res.status(200).json(
      lines.map((line) => ({
        id: Number(line._id),
        name: line.name,
        color: line.color,
        stations: line.stations,
        sections: line.sections,
        createdDate: line.createdDate,
        modifiedDate: line.updatedDate,
      }))
    );
  });
});

// POST LINES
router.post(`/`, auth, (req, res) => {
  const { name, color, upStationId, downStationId, distance, duration } = req.body;

  if (upStationId === downStationId) {
    return res.status(400).json({ message: '상행역과 하행역은 서로 같을 수 없습니다.' });
  }

  let stations = [];

  Station.find((error, stationList) => {
    if (error) {
      return res.status(400).json({ message: '존재하는 지하철 역이 없습니다.' });
    }

    stations = stationList
      .filter(({ _id }) => _id === Number(upStationId) || _id === Number(downStationId))
      .map((station) => ({ ...station, id: station._id }));

    const line = new Line({
      name,
      color,
      stations,
      sections: [{ upStation: upStationId, downStation: downStationId, distance, duration }],
    });

    line.save((error, lineInfo) => {
      if (error) {
        console.error(error);
        return res.status(400).json({ success: false, message: '등록 실패' });
      }

      return res.status(200).json({
        id: lineInfo._id,
        name: lineInfo.name,
        color: lineInfo.color,
        stations: lineInfo.stations,
        sections: lineInfo.sections,
        createdDate: lineInfo.createdDate,
        updatedDate: lineInfo.updatedDate,
      });
    });
  });
});

router.param('id', function (req, res, next, id) {
  req.id = Number(id);

  next();
});

router.put(`/:id`, (req, res) => {
  return res.status(200).json({ message: 'temp' });
});

router.delete(`/:id`, (req, res) => {
  return res.status(200).json({ message: 'temp' });
});

module.exports = router;
