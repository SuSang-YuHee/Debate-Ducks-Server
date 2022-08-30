# DEBATE DUCKS

> 키보드 배틀은 그만! 실시간 영상 토론 배틀 플랫폼 [DEBATE DUCKS](https://debate-ducks.click)

1. 언제 어디서나 쉬운 토론 참여!
2. 체계적인 토론 진행!
3. 영상으로 남는 나의 토론!

- 웹 사이트: [https://debate-ducks.click](https://debate-ducks.click)
- 클라이언트 저장소: [https://github.com/SuSang-YuHee/Debate-Ducks-Client](https://github.com/SuSang-YuHee/Debate-Ducks-Client)
- 이전 버전 저장소: [https://github.com/codestates/debate-ducks](https://github.com/codestates/debate-ducks)

## Release

### Debate Ducks 2.0.0

- 회원가입 / 사용자 정보 수정
- 토론 생성, 수정 및 삭제
- 실시간 영상 토론
- 좋아요, 팩트체크, 투표 및 댓글

# 소개

## 실시간 토론 플랫폼의 웹 서버 구현

- 프로젝트 명칭 : Debate-Ducks-Server
- 개발 인원 : 2명
- 개발 기능 :
  - 실시간 영상 토론, 비디오 저장 및 스트리밍 기능
  - 유저 회원가입, 로그인, 유저 정보 수정
  - 댓글 기능, 좋아요 기능, 투표 기능, 팩트체크 기능

## 사용 기술

- 주요 프레임워크 / 라이브러리
  - Node 16.13.0, npm 8.1.0
  - Javascript, Typescript
  - NestJS 8.2.6
  - TypeORM
  - Socket.io
- 데이터베이스 : MySQL
- 형상관리 툴 : Github
- 배포 환경 : AWS EC2, ELB, Route53, CloudFront, S3, RDS, Github Actions

## 데이터베이스 설계

![debate-ducks-table](https://user-images.githubusercontent.com/25292654/187236752-e17c0ff0-3d9a-4ded-98aa-66cff892808e.png)

<img width="796" alt="스크린샷 2022-08-30 오전 2 18 36" src="https://user-images.githubusercontent.com/25292654/187265300-4f5addef-9ad0-4edb-99f6-d519dcb579b9.png">

![스크린샷 2022-08-30 오전 3 04 32](https://user-images.githubusercontent.com/25292654/187268473-158e7f8c-c070-4259-84ac-08776dc09e91.png)

![스크린샷 2022-08-30 오전 3 04 11](https://user-images.githubusercontent.com/25292654/187268619-97e5d035-53b6-44c7-8617-58278353558d.png)

![스크린샷 2022-08-30 오전 2 37 53](https://user-images.githubusercontent.com/25292654/187265483-b114088d-80e3-4f35-838f-1f2e9da74d6b.png)

![스크린샷 2022-08-30 오전 3 03 38](https://user-images.githubusercontent.com/25292654/187268690-0caaa59f-0f36-48b2-9e2f-53fd969f156d.png)

![스크린샷 2022-08-30 오전 2 41 30](https://user-images.githubusercontent.com/25292654/187265647-53e66ae3-08eb-40e4-ae16-e0172e3677fb.png)

## API 설계 : 자세한 사항은 [Swagger 문서](https://server.debate-ducks.click/api)를 참고해주세요 :)

- ### 유저 API

<img width="484" alt="스크린샷 2022-08-30 오전 12 27 19" src="https://user-images.githubusercontent.com/25292654/187237738-f956525a-c4c2-4a11-9db7-6db0b9a91603.png">

- ### 토론 API

<img width="483" alt="스크린샷 2022-08-30 오전 12 28 52" src="https://user-images.githubusercontent.com/25292654/187237894-8c1dfb5b-7f90-44f1-8fbe-8ea82df5ac71.png">

- ### 팩트체크 API

<img width="480" alt="스크린샷 2022-08-30 오전 12 28 58" src="https://user-images.githubusercontent.com/25292654/187238085-767084a3-d14a-4a8c-b81a-ebb6e5a561e4.png">

- ### 투표 API

<img width="482" alt="스크린샷 2022-08-30 오전 12 29 03" src="https://user-images.githubusercontent.com/25292654/187238228-f95fdc88-944b-4ea8-8244-0df63dfe7d18.png">

- ### 좋아요 API

<img width="482" alt="스크린샷 2022-08-30 오전 12 29 14" src="https://user-images.githubusercontent.com/25292654/187238301-ab977523-bb50-4bf9-9f04-4ae0684b7f40.png">

- ### 댓글 API
<img width="484" alt="스크린샷 2022-08-30 오전 12 29 18" src="https://user-images.githubusercontent.com/25292654/187238393-93cf8af6-47d1-46e8-8a5f-1b1f0361ca35.png">

# 담당했던 기능들

## 박상봉

- 토론 모듈 - CRUD 기능, 토론 리스트 조회, 검색 및 검색 리스트 조회
- 유저 모듈 - 회원가입, 비밀번호 암호화(Bcrypt), 로그인(JWT 사용한 인가), 유저 정보 수정, 유저가 작성한 컨텐츠 리스트 조회, 프로필 사진 등록 및 변경 시 확장자 검사
- 댓글 모듈 - CRUD 기능, 댓글 리스트 조회
- 좋아요 모듈 - 좋아요 생성, 좋아요 확인, 좋아요 취소
- 투표 모듈 - 투표 생성, 투표 여부 조회, 재투표, 해당 토론의 찬반 투표수 조회, 투표 취소
- 팩트체크 모듈 - 팩트체크 생성, 수정, 삭제
- 공통
  - DTO를 통한 유효성 검사
  - 리스트 조회에 정렬, 페이징 처리 구현
  - 검증 파이프(validation pipe)를 부트스트랩 과정에서 적용하여 전역 설정, class-validator를 사용해 유효성 검사를 하는 파이프 적용
  - 유효성 검사 통과 후 발생할 수 있는 서비스 로직 내에서 에러 발생시 예외 처리
  - 가드를 이용한 인증, 인가
  - 인터셉터를 이용한 로깅

---

- Date 타입의 시차 해결을 위한 타임존 설정
- 데이터베이스 스키마 설계 및 ORM으로 기능 구현
- Swagger 통한 API 문서화
- 팀원간 AWS 사용을 위해 IAM 생성 및 공유
- 서버 https 배포 환경 구축
- 클라이언트 https 배포 환경 구축
- 클라이언트 다이나믹 라우팅을 위한 AWS Lambda로 .html 경로 처리
- 클라이언트 배포 자동화

## 정유찬

- 실시간 영상 토론 기능 구현
