# AI English Trainer (Front)

> AI 기반 맞춤형 영어 학습 플랫폼  
> OpenAI GPT를 활용한 토익/영작 문제 자동 생성 및 자동 채점 시스템

---

## 📌 프로젝트 개요

사용자가 입력한 영어 단어를 기반으로 AI가 자동으로 예문, 품사, 의미, 유의어/반의어를 생성하고, 토익(TOEIC) 문제 또는 영작 문제를 자동 출제하는 학습 시스템입니다. Google Cloud TTS를 통해 생성된 텍스트를 음성으로 들을 수 있으며, 학습한 내용을 체계적으로 관리할 수 있습니다.

### 주요 기능

- **회원 인증 시스템**: JWT 토큰 기반 로그인/회원가입
- **예문 생성기**: 단어를 입력하면 AI가 품사별 뜻, 예문 3개, 유의어/반의어를 제공
- **영어 문제 생성기**: 토익(Part 5/6/7) 및 영작 문제 자동 출제
- **나의 단어장**: 저장한 단어와 예문을 언제든지 확인하고 관리
- **저장된 문제**: 생성한 문제를 저장하고 복습 가능
- **TTS 음성 재생**: Google Cloud TTS 및 Web Speech API를 통한 텍스트 음성 변환

### 페이지 구성

| 페이지 | 설명 |
|--------|------|
| **로그인/회원가입** | JWT 기반 사용자 인증 |
| **홈(Home)** | 서비스 소개 및 기능 안내 |
| **예문 생성기(ExampleGenerator)** | 단어 입력 시 예문, 뜻, 관련 단어 생성 |
| **영어 문제(WritingProblem)** | 토익/영작 문제 생성 및 풀이 |
| **나의 단어장(Vocabulary)** | 저장된 단어 및 예문 관리 |
| **저장된 문제(MyQuestions)** | 생성한 문제 저장 및 복습 |

---

## 💡 핵심 구현 사항

### 1. 영작 문제Levenshtein Distance 알고리즘 구현
- 유사도(50%) + 키워드 매칭(30%) + 길이 점수(20%) **가중 평균**으로 0~100점 자동 채점
- 사용자 답안과 모범 답안의 편집 거리를 기반으로 정확도 평가

### 2. TTS 이중화 시스템
- **Google Cloud TTS API** 우선 사용으로 고품질 음성 제공
- 실패 시 **Web Speech API**로 자동 폴백

### 3. JWT 기반 인증 시스템
- **Axios 인터셉터**를 활용한 JWT 토큰 자동 관리
- 401/403 에러 발생 시 자동 로그아웃 및 리다이렉트
- LocalStorage를 활용한 토큰 관리

### 4. 재사용 가능한 컴포넌트 설계
- **styled-components**를 활용한 UI 컴포넌트 모듈화
- Button, Card, Input 등 atomic 패턴 적용

---

## 🛠️ 기술 스택
- React 19 + TypeScript + Vite
- styled-components, React Router
- Axios (JWT 인증)
- Google Cloud TTS / Web Speech API

---

## 📁 프로젝트 구조
```
src/
├── components/       # 재사용 컴포넌트 (Button, Card, Input, SpeakerButton 등)
├── pages/           # 페이지 (Login, Home, ExampleGenerator, WritingProblem 등)
├── services/        # API 통신 (Axios 인스턴스, JWT 인터셉터)
├── utils/           # 유틸리티 (grading.ts: 채점 알고리즘, tts.ts: 음성 재생)
└── App.tsx          # 라우팅 및 인증 가드
```

---

## 🚀 설치 및 실행

### 1. 저장소 클론 및 의존성 설치
```bash
git clone https://github.com/HeoSeonJin0504/ai-english-trainer-front.git
cd ai-english-trainer-front
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 백엔드 서버 주소를 설정하세요:
```env
# Node.js 백엔드 사용 시
VITE_API_BASE_URL=http://localhost:3000/api

# Spring Boot 백엔드 사용 시
# VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

---

## 📝 주요 기능 상세

### 1. 회원 인증 시스템

#### 회원가입
- **필수 정보**: 아이디, 비밀번호, 전화번호, 성별, 나이
- **선택 정보**: 이메일
- **중복 확인**: 아이디 및 전화번호 중복 체크
- **유효성 검증**: 실시간 입력 검증

#### 로그인
- **JWT 토큰 발급**: 서버로부터 Access Token 수령
- **자동 토큰 관리**: Axios 인터셉터를 통한 자동 헤더 추가
- **토큰 만료 처리**: 만료 시 자동 로그아웃 및 로그인 페이지 리다이렉트
- **보호된 라우트**: 인증되지 않은 사용자의 접근 차단

### 2. 예문 생성기

- **단어 입력**: 영어 단어만 입력 가능 (한글 입력 차단)
- **AI 예문 생성**: 단어의 품사별 뜻, 3개의 예문, 유의어/반의어 제공
- **TTS 음성 재생**: 
  - 단어 및 예문을 음성으로 들을 수 있음
  - Google Cloud TTS 우선 사용, 실패 시 Web Speech API로 자동 전환
  - 재생 속도 조절 가능 (느리게/보통/빠르게)
- **단어장 저장**: 
  - 단어 및 개별 예문 저장 가능
  - 유의어/반의어도 별도 저장 가능

### 3. 영어 문제 생성기

#### 토익 모드
- **Part 5**: 문법·어휘 문제
- **Part 6**: 지문 기반 문장 삽입 문제
- **Part 7**: 독해 문제
- **기능**:
  - 정답 확인 및 해설 제공
  - 모든 문제 일괄 저장
  - 개별 문제 선택 저장
  - TTS로 지문 읽기 가능

#### 영작 모드
- **4가지 문제 유형**: 
  - 상황 설명 영작 (situation)
  - 한→영 번역 (translation)
  - 문장 고치기 (fix)
  - 짧은 답변 (short-answer)
- **자동 채점**: 
  - Levenshtein Distance를 활용한 유사도 계산
  - 키워드 매칭 점수
  - 길이 적정성 점수
  - 종합 점수 0~100점 산출
  - 점수별 피드백 제공
- **모범 답안**: 학습 후 모범 답안 확인 가능
- **문제 저장**: 생성한 문제를 저장하여 복습 가능

### 4. 나의 단어장

- **탭 구성**: 단어 탭 / 예문 탭
- **단어 관리**:
  - 저장된 단어 목록 확인
  - 품사, 의미 표시
  - TTS로 발음 듣기
  - 검색 기능
  - 개별 삭제
- **예문 관리**:
  - 저장된 예문 목록 확인
  - 연결된 단어 정보 표시
  - TTS로 문장 듣기
  - 검색 기능
  - 개별 삭제

### 5. 저장된 문제

- **탭 구성**: 전체 / 토익 / 영작
- **파트별 필터**: 토익 Part 5/6/7 필터링
- **검색 기능**: 주제(Topic)로 검색
- **문제 정보**:
  - 모드, 파트/유형, 주제 표시
  - 지문, 문제, 선택지, 정답, 해설 확인
  - 생성 날짜 표시
- **문제 관리**: 개별 삭제 가능

---

## 개발

본 프로젝트는 GitHub Copilot (Claude Sonnet 4.5)를 활용하여 코드 작성, 리팩토링 작업을 수행했습니다.

---

## 저장소
본 프로젝트는 2개의 저장소로 구성되어 있습니다:

- **프론트엔드 (React)** - 현재 저장소
  
- **백엔드 (Node.js)** - API 서버 및 Google Cloud TTS 연동
  - https://github.com/HeoSeonJin0504/ai-english-trainer-node.git

- **백엔드 (Java Spring)** - API 서버 및 Google Cloud TTS 연동
  - https://github.com/HeoSeonJin0504/ai-english-trainer-spring.git