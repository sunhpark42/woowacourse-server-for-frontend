# 레벨 1 지하철 노선도 미션

### HOST : ${URL}/level1/subway

## Member

### 로그인

- request

```bash
POST /login/token

body : {
  email: String,
  password: String,
}
```

- response

```js
{
  accessToken: String,
}
```

### 내 정보 불러오기

- request

```bash
GET /members/me
header: {
  Authorization: Bearer ${accessToken};
}

```

- response

```js
{
  name: String,
  email: String,
}
```

### 회원가입

- request

```bash
POST /members

body : {
  email: String,
  name: String,
  password: String,
}
```

- response

```js
{
  success: Boolean,
  message: String,
}
```

### 이메일 중복체크

- request

```bash
GET /members/check-validation

body : {
  email: String,
}
```

- response

```js
{
  message: String,
}
```

- 이메일 중복시 `status 400, message: '중복된 이메일 입니다.'`

## Station

### 역 조회

- request

```bash
GET /stations
```

- response

```js
[
  {
    id: Number,
    name: String,
    createdDate: Date,
    updatedDate: Date,
  },
  ...
];
```

### 역 추가

- request

```bash
POST /stations
header: {
  Authorization: Bearer ${accessToken};
  Content-Type: application/json;
}
body : {
  name: String,
}
```

- response

```js
  {
    id: Number,
    name: String,
    createdDate: Date,
    updatedDate: Date,
  }
```

### 역 수정

- request

```bash
PUT /stations/:id
header: {
  Authorization: Bearer ${accessToken};
}
body : {
  name: String,
}
```

- response

```js
  {
    id: Number,
    name: String,
    createdDate: Date,
    updatedDate: Date,
  }
```

### 역 삭제

- request

```bash
DELETE /stations/:id
header: {
  Authorization: Bearer ${accessToken};
}
```

- response

```js
{
  message: String;
}
```
