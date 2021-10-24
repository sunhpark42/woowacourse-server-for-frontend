const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const cors = require('cors');

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

const auth = require('./middleware/auth');

const { User } = require('./level1-subway/models/User');
const { Station } = require('./level1-subway/models/Station');
const { Line } = require('./level1-subway/models/Line');

const Level1Subway = require('./level1-subway/index');
app.use(LEVEL1_SUBWAY_HOST, Level1Subway);

//로그인
app.post(`${LEVEL1_SUBWAY_HOST}/login/token`, (req, res) => {
  // 데이터 베이스에서 해당 이메일 찾기
  User.findOne({ email: req.body.email }, (error, user) => {
    if (!user) {
      return res.status(400).json({ loginSuccess: false, message: '없는 유저입니다.' });
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
        res.status(200).json({ accessToken: user.token });
      });
    });
  });
});

app.get(`${LEVEL1_SUBWAY_HOST}/sections`, (req, res) => {
  return res.status(200).json({ message: 'temp' });
});

// auth middleware 이용
app.get(`${LEVEL1_SUBWAY_HOST}/auth`, auth, (req, res) => {
  // middleware passed

  res.status(200).json({ _id: req.user._id, name: req.user.name, email: req.user.email });
});

app.listen(port, () => console.log(`Example App ${port}`));
