const express = require('express');
const memberRouter = express.Router();

const { User } = require('../models/User');

const auth = require('../../middleware/auth');
const { default: APPLICATION_CODE } = require('../constants/applicationCode');

memberRouter.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// 회원가입
memberRouter.post(`/`, (req, res) => {
  const user = new User(req.body);

  user.save((error, userInfo) => {
    if (error) {
      console.error(error);
      return res.json({ code: APPLICATION_CODE.SIGN_UP_ERROR, message: '회원가입에 실패했습니다.' });
    }

    return res.status(200).json({ message: '회원가입 성공!' });
  });
});

// 이메일 중복체크
memberRouter.get(`/check-validation`, (req, res) => {
  if (!req.query.email) {
    return res.status(400).json({ code: APPLICATION_CODE.BAD_REQUEST, message: '쿼리 파라미터가 유효하지 않습니다.' });
  }

  User.findOne({ email: req.query.email }, (error, user) => {
    if (user) {
      return res.status(400).json({ code: APPLICATION_CODE.EMAIL_DUPLICATED_ERROR, message: '중복된 이메일 입니다.' });
    } else {
      return res.status(200).json({ message: '중복된 이메일이 아닙니다.' });
    }
  });
});

// 내정보
memberRouter.get(`/me`, auth, (req, res) => {
  res.status(200).json({ name: req.user.name, email: req.user.email });
});

module.exports = memberRouter;
