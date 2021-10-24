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

const { User } = require('./level1-subway/models/User');
const { Station } = require('./level1-subway/models/Station');
const { Line } = require('./level1-subway/models/Line');

const Stations = require('./level1-subway/api/stations');
app.use(`${LEVEL1_SUBWAY_HOST}/stations`, Stations);

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

app.get(
  `${LEVEL1_SUBWAY_HOST}/members/me`,
  (req, res, next) => {
    // 인증처리를 하는 부분
    // 클라이언트 쿠키에서 토큰 가져오기
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(400).json({ message: '토큰없음 ' });
    }

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

    res.status(200).json({ name: req.user.name, email: req.user.email });
  }
);

// LINES
app.get(`${LEVEL1_SUBWAY_HOST}/lines`, (req, res) => {
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
app.post(
  `${LEVEL1_SUBWAY_HOST}/lines`,
  (req, res, next) => {
    // 인증처리를 하는 부분
    // 클라이언트 쿠키에서 토큰 가져오기
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(400).json({ message: '토큰없음 ' });
    }

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
  }
);

app.put(`${LEVEL1_SUBWAY_HOST}/lines/:id`, (req, res) => {
  return res.status(200).json({ message: 'temp' });
});

app.delete(`${LEVEL1_SUBWAY_HOST}/lines/:id`, (req, res) => {
  return res.status(200).json({ message: 'temp' });
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
