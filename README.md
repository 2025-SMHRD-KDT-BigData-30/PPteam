# 핵심 프로젝트
팀명 : P도 계획이 P료해

팀원 : 황채리, 안지은, 윤병민, 박우진, 고광진

## 프로젝트 소개
OCR 기반 업무관리프로그램

## 개발 기간
04/07 ~ 04/18

## 리버스 엔지니어링
업무관리프로그램

## 챌린지 포인트
외부API

SNS로그인

다크모드

## 아이디어 주제
React + Spring MVC + Flask를 통합하여 만든 웹 기반 학습 지원 플랫폼


## 주요 기능
-  이미지 업로드 → OCR 분석 (Flask + Clova OCR)
-  키워드 및 텍스트 추출
-  날짜별 OCR 결과 조회 (FullCalendar 연동)
-  키워드 기반 퀴즈 추천
-  키워드 빈도 시각화 (nivo pie chart)
-  마이페이지, 통계, 퀴즈 페이지 완성
-  Spring MVC, MyBatis, MySQL 연동
-  React 정적 파일 자동 빌드/복사 설정


## 기술 스택
| 영역 | 기술 |
|------|------|
| 프론트엔드 | React, Axios, FullCalendar, Nivo Charts |
| 백엔드 | Spring MVC (non-Boot), MyBatis, HikariCP |
| OCR 서버 | Flask, Naver CLOVA OCR, MeCab 형태소 분석기 |
| 데이터베이스 | MySQL (port 3307) |
| 배포 서버 | Tomcat 8.5 (Eclipse + eGovFrame 기반) |
| 빌드도구 | Maven (`.war` 빌드) |


#### nivo 차트

npm install @nivo/pie @nivo/core d3-shape --force


+ react 버전 조정필요
 
npm install react@18.3.1 react-dom@18.3.1

"react": "^18.3.1",

"react-dom": "^18.3.1",



#### fullcalendar 라이브러리

npm install axios react-router-dom react-modal react-icons

npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/interaction


#### 플라스크 서버 구축 

!pip install scikit-learn

!pip install Flask flask-cors scikit-learn nltk

!pip install nltk

!pip install eunjeon

!pip install flask

!pip install flask-cors

!pip install pillow

!pip install pytesseract


#### NLTK 데이터 다운로드 (최초 실행 시 필요)

nltk.download('stopwords')
