const APPLICATION_CODE = require('../level1-subway/constants/applicationCode');
const { User } = require('../level1-subway/models/User');

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(400).json({ code: APPLICATION_CODE.BAD_REQUEST, message: '토큰 정보가 없습니다.' });
  }

  // 토큰을 복호화 한 후 유저를 찾는다.
  User.findByToken(token, (error, user) => {
    if (error) {
      throw error;
    }

    if (!user) {
      return res.status(400).json({
        code: APPLICATION_CODE.FIND_USER_BY_TOKEN_ERROR,
        message: '해당 토큰을 사용하는 유저를 찾을 수 없습니다.',
      });
    }

    // 이후 cb에서 정보를 이용하기 위함
    req.token = token;
    req.user = user;

    next();
  });
};

module.exports = auth;
