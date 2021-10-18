# 우아한 테크코스 프론트엔드를 위한 서버

- 우아한 테크코스 프론트엔드 진행 미션 API 서버입니다. 현재는 local에서만 돌아가고 있는 중입니다. 기본 포트는 5000으로 설정해 두었습니다.

- 이 코드를 직접 heroku 등에 배포하는 식으로 사용해도 무방합니다. 다만 User.js 안에 있는 saltKey를 바꾸고 사용해주세요. 추후에 환경변수로 빠질 예정이니 조금만 기다려 주셔도 좋습니다.

- 혹시나 이 API가 먼저 있으면 좋겠다하는게 있다면 제보 주세요. 🎃

- 현재 에러코드는 별다른 구분없이 400 으로 통일되어있습니다.

- mode dev 사용방법

1. mongoDB 가입 및 Database 생성
2. config 폴더에 dev.js 추가

- mongoDB에서 클러스터 생성시 나오는 거 복붙

```
const PASSWORD = {myPassword};

module.exports = {
  mongoURI: `mongodb+srv://{name}:${PASSWORD}@${yourDBname}.ccf2x.mongodb.net/testDB?retryWrites=true&w=majority`,
};
```

3. 실행

```
yarn && yarn dev
```

## 1. 레벨 1 지하철 노선도

- host : '/level1/subway'
- [API 명세](https://github.com/sunhpark42/woowacourse-server-for-frontend/docs/API_level1_subway.md)
- 제작 진행 상황 (21. 10. 18 update)
  - 이메일 중복체크 API
  - 회원가입 API
  - 로그인 API
  - 내정보 불러오기 API
  - 역 조회 API
  - 역 추가 API
  - 역 수정 API
  - 역 삭제 API
