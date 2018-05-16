프로젝트 세팅 법

1.  프로젝트 pull 받고 node package manager 설치

```
git pull ${url}
```

pull 받은 후

node_modules 를 설치하기위해 yarn 혹은 npm install 을 실행한다.

2.  환경변수 설정을 위한 .env 파일 생성

데이터 베이스 정보를 환경변수로 담아준다.

```
( example )
PORT=3000
MONGO_URI=mongodb://127.0.0.1/db_name
```
