const express = require('express');
const router = express.Router();

const { default: APPLICATION_CODE } = require('../constants/applicationCode');

const { User } = require('../models/User');

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.post(`/token`, (req, res) => {
  // 데이터 베이스에서 해당 이메일 찾기
  User.findOne({ email: req.body.email }, (error, user) => {
    if (!user) {
      return res
        .status(400)
        .json({ code: APPLICATION_CODE?.SIGN_IN_ERROR, message: '로그인 정보가 유효하지 않습니다.' });
    }

    // 요청된 이메일이 데이터 베이스에 있다면, 비밀번호가 맞는 비밀번호인지 확인하기.
    user.comparePassword(req.body.password, (error, isMatched) => {
      if (!isMatched) {
        return res
          .status(400)
          .json({ code: APPLICATION_CODE?.SIGN_IN_ERROR, message: '로그인 정보가 유효하지 않습니다.' });
      }

      // 비밀번호가 같다면 토큰 생성
      user.generateToken((error, user) => {
        if (error) {
          return res.status(400).send(error);
        }

        // 토큰을 저장한다.
        res.status(200).json({ accessToken: user.token });
      });
    });
  });
});

module.exports = router;
