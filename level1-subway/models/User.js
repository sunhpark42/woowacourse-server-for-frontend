const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

const User = mongoose.model('User', userSchema);

module.exports = { User };
