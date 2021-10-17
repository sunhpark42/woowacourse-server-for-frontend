const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;

// Schema 생성
const Schema = mongoose.Schema;

const userSchema = Schema({
  name: {
    type: String,
    maxLength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    minLength: 5,
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

//userModel에 user 정보를 저장하기 전에 callback함수를 실행
userSchema.pre('save', function (next) {
  const user = this;

  if (user.isModified('password')) {
    //비밀번호 암호화
    bcrypt.genSalt(saltRounds, function (error, salt) {
      if (error) {
        return next(error);
      }

      bcrypt.hash(user.password, salt, function (error, hash) {
        if (error) {
          return next(error);
        }

        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, callback) {
  bcrypt.compare(plainPassword, this.password, function (error, isMatched) {
    if (error) {
      return callback(error);
    }

    callback(null, isMatched);
  });
};

userSchema.methods.generateToken = function (callback) {
  const user = this;
  // jsonwebtoken을 이용해 토큰생성

  console.log(user._id.toHexString());
  const token = jwt.sign(user._id.toHexString(), 'secretToken');

  user.token = token;
  user.save(function (error, user) {
    if (error) {
      return callback(error);
    }

    callback(null, user);
  });
};

userSchema.statics.findByToken = function (token, callback) {
  const user = this;

  // 토큰 decode
  jwt.verify(token, 'secretToken', function (error, decodedUserId) {
    // 유저아이디를 이용해 유저를 찾음

    // 클라이언트의 토큰과 DB에 보관된 토큰이 일치하는지 확인
    user.findOne({ _id: decodedUserId, token: token }, function (error, user) {
      if (error) {
        return callback(error);
      }

      callback(null, user);
    });
  });
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
