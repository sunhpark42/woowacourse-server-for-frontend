const APPLICATION_CODE = {
  // common
  BAD_REQUEST: 400,

  // authentification
  FIND_USER_BY_TOKEN_ERROR: 1000,
  SIGN_UP_ERROR: 1001,
  EMAIL_DUPLICATED_ERROR: 1002,

  // stations : 2000 - 2999
  CREATE_STATION_ERROR: 2000,
};

module.exports = APPLICATION_CODE;
