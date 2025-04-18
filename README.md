# 🧠 P도 계획이 P료해 - OCR 기반 학습 일정 관리 시스템

> **팀명**: P도 계획이 P료해  
> **팀원**: 황채리, 안지은, 윤병민, 박우진, 고광진  
> **개발 기간**: 2025.04.07 ~ 2025.04.18  

---

## 📝 프로젝트 소개

> **OCR 기반 업무관리 프로그램**

React + Spring MVC + Flask를 통합하여 만든 웹 기반 학습 지원 플랫폼입니다.  
이미지를 통해 텍스트 및 키워드를 자동으로 추출하고,  
사용자의 학습 흐름에 따라 퀴즈를 추천하는 기능까지 포함된 **통합 학습 시스템**입니다.

---

## 🔍 핵심 키워드

- 📸 **이미지 업로드 기반 OCR 분석**
- 🧠 **키워드 추출 + 빈도 통계 시각화**
- 📅 **FullCalendar 기반 일정 관리**
- ❓ **퀴즈 추천 시스템**
- 🌐 **Spring MVC + React + Flask 통합**
- 🌙 **다크모드 / 외부 API / SNS 로그인 도전**

---

## ⚙️ 주요 기능

- ✅ 이미지 업로드 → Flask + CLOVA OCR 분석
- ✅ 키워드 및 텍스트 추출 (MeCab 분석)
- ✅ 날짜별 OCR 결과 조회 (FullCalendar 연동)
- ✅ 키워드 기반 퀴즈 추천
- ✅ 사용자 통계 → Nivo Pie 차트로 시각화
- ✅ 마이페이지 기능, 통계, 퀴즈 페이지 완성
- ✅ React build 자동 Spring 연동 처리
- ✅ MyBatis, MySQL 완전 연동

---

## 💻 기술 스택

| 영역         | 기술                                                    |
|--------------|---------------------------------------------------------|
| 프론트엔드   | React, Axios, FullCalendar, Nivo Pie, React Router     |
| 백엔드       | Spring MVC (non-Boot), MyBatis, HikariCP               |
| OCR 서버     | Flask, Naver CLOVA OCR, MeCab (eunjeon)                |
| DB           | MySQL (port 3307)                                       |
| 배포 환경    | Apache Tomcat 8.5 (Eclipse, eGovFrame 기반)            |
| 빌드 도구    | Maven (`.war` 빌드)                                     |

---

## 📦 라이브러리 설치 가이드

### 🔸 React 라이브러리

```bash
# FullCalendar & 기타
npm install axios react-router-dom react-modal react-icons

npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/interaction

# Nivo 차트 & React 버전 호환
npm install @nivo/pie @nivo/core d3-shape --force
npm install react@18.3.1 react-dom@18.3.1
