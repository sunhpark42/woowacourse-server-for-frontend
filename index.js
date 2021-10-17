const express = require('express');
const app = express();
const port = 5000;

const bodyParser = require('body-parser');

const config = require('./config/key');

//application/x-www-from-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());

// MongoDB connection
const mongoose = require('mongoose');

mongoose
  .connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error(error));

app.get('/', (req, res) => res.send('hello world!'));

const LEVEL1_SUBWAY_HOST = '/level1/subway';

const { User } = require('./level1-subway/models/User');

app.get(`${LEVEL1_SUBWAY_HOST}/members/check-validation`, (req, res) => {
  return res.status(200);
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
  // 데이터 베이스에서 해당 이메일 찾기
});

app.listen(port, () => console.log(`Example App ${port}`));
