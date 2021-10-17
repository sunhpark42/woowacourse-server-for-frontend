const { User } = require('../level1-subway/models/User');

const auth = (req, res, next) => {
  // 인증처리를 하는 부분
  // 클라이언트 쿠키에서 토큰 가져오기
  const token = req.cookies.x_auth;

  // 토큰을 복호화 한 후 유저를 찾는다.

  User.findByToken(token, (error, user) => {
    if (error) {
      throw error;
    }

    if (!user) {
      return res.json({ isAuthenticated: false, error: true });
    }

    // 이후 cb에서 정보를 이용하기 위함
    req.token = token;
    req.user = user;

    next();
  });
};

module.exports = auth;
