const express = require('express');
const app = express();
const port = 5000;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const cors = require('cors');

const { auth } = require('./middleware/auth');

const config = require('./config/key');

//application/x-www-from-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());

app.use(cookieParser());

app.use(cors());

// MongoDB connection
const mongoose = require('mongoose');

mongoose
  .connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error(error));

app.get('/', (req, res) => res.send('hello world!'));

const LEVEL1_SUBWAY_HOST = '/level1/subway';

const { User } = require('./level1-subway/models/User');

// 이메일 중복체크
app.get(`${LEVEL1_SUBWAY_HOST}/members/check-validation`, (req, res) => {
  if (!req.query.email) {
    return res.status(400).json({ message: '쿼리 파라미터가 유효하지 않습니다.' });
  }

  User.findOne({ email: req.query.email }, (error, user) => {
    if (user) {
      return res.status(400).json({ message: '중복된 이메일 입니다.' });
    } else {
      return res.status(200).json({ message: '중복된 이메일이 아닙니다.' });
    }
  });
});

app.post(`${LEVEL1_SUBWAY_HOST}/members`, (req, res) => {
  // 회원가입시 필요한 정보를 client에게 받아 DB에 삽입

  const user = new User(req.body);

  user.save((error, userInfo) => {
    if (error) {
      console.error(error);
      return res.json({ success: false, message: '회원가입에 실패했습니다.' });
    }

    return res.status(200).json({ success: true, message: '회원가입 성공!' });
  });
});

//로그인
app.post(`${LEVEL1_SUBWAY_HOST}/login`, (req, res) => {
  console.log('getResquest', req);
  // 데이터 베이스에서 해당 이메일 찾기
  User.findOne({ email: req.body.email }, (error, user) => {
    if (!user) {
      return res.json({ loginSuccess: false, message: '없는 유저입니다.' });
    }

    // 요청된 이메일이 데이터 베이스에 있다면, 비밀번호가 맞는 비밀번호인지 확인하기.
    user.comparePassword(req.body.password, (error, isMatched) => {
      if (!isMatched) {
        return res.json({ loginSuccess: false, message: '비밀번호가 일치하지 않습니다.' });
      }

      // 비밀번호가 같다면 토큰 생성
      user.generateToken((error, user) => {
        if (error) {
          return res.status(400).send(error);
        }

        // 토큰을 저장한다.
        res.cookie('x_auth', user.token).status(200).json({ loginSuccess: true, userId: user._id, token: user.token });
      });
    });
  });
});

// auth middleware 이용
app.get(
  `${LEVEL1_SUBWAY_HOST}/auth`,
  (req, res, next) => {
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
  },
  (req, res) => {
    // middleware passed

    res.status(200).json({ _id: req.user._id, name: req.user.name, email: req.user.email });
  }
);

app.listen(port, () => console.log(`Example App ${port}`));
