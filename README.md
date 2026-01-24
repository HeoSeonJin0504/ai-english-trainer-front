# AI English Trainer (Front)

AI English Trainer는 OpenAI GPT와 Google Cloud TTS를 활용한 영어 학습 플랫폼입니다.

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

## 🛠️ 기술 스택 (Tech Stack)

### Core
- **React 19** - 사용자 인터페이스 구축
- **TypeScript** - 타입 안정성 및 개발 생산성 향상
- **Vite** - 빠른 개발 서버 및 빌드 도구

### UI/UX
- **styled-components** - CSS-in-JS 스타일링
- **React Router DOM** - 페이지 라우팅 및 네비게이션

### HTTP 통신
- **Axios** - REST API 통신 및 인터셉터를 통한 JWT 토큰 관리

### 인증
- **JWT (JSON Web Token)** - 토큰 기반 인증
- **LocalStorage** - 토큰 및 사용자 정보 저장

### TTS (Text-to-Speech)
- **Google Cloud TTS API** - 고품질 음성 합성 (우선)
- **Web Speech API** - 브라우저 기본 TTS

### 코드 품질
- **ESLint** - 코드 품질 검사
- **TypeScript ESLint** - TypeScript 린트 규칙

---

## 📁 프로젝트 구조
```
ai-english-trainer-front/
├── public/                
├── src/
│   ├── components/       # 재사용 가능한 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── Header.tsx           # 네비게이션 및 인증 상태 표시
│   │   ├── Input.tsx
│   │   ├── Loading.tsx
│   │   └── SpeakerButton.tsx    # TTS 재생 버튼
│   ├── pages/            # 페이지 컴포넌트
│   │   ├── Home.tsx
│   │   ├── Login.tsx            # 로그인
│   │   ├── Signup.tsx           # 회원가입
│   │   ├── ExampleGenerator.tsx # 예문 생성기
│   │   ├── WritingProblem.tsx   # 문제 생성기
│   │   ├── Vocabulary.tsx       # 단어장
│   │   ├── MyQuestions.tsx      # 저장된 문제
│   │   └── index.ts
│   ├── services/         # API 통신 로직
│   │   └── api.ts        # Axios 인스턴스, JWT 인터셉터 및 API 함수
│   ├── utils/            # 유틸리티 함수
│   │   ├── grading.ts    # 영작 채점 로직 (Levenshtein Distance)
│   │   ├── tts.ts        # TTS 재생 유틸리티
│   │   └── vocabulary.ts # 단어장 관리 (사용 안 함, 서버 API 사용)
│   ├── App.tsx           # 라우팅 및 인증 가드
│   └── main.tsx          
├── .env                   # 환경 변수
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 설치 및 실행

### 1. 저장소 클론
```bash
git clone <repository-url>
cd ai-english-trainer-front
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 설정하세요:
```env
# 백엔드 API 서버 주소
VITE_API_BASE_URL=http://localhost:8080/api
```

### 4. 개발 서버 실행
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

## 🔐 인증 시스템

### JWT 토큰 관리

- **저장 위치**: LocalStorage
- **자동 갱신**: Axios 인터셉터를 통한 자동 헤더 추가
- **만료 처리**: 401/403 에러 발생 시 자동 로그아웃 및 리다이렉트
- **토큰 검증**: 매 요청마다 서버에서 검증

### 보호된 라우트
```typescript
// 인증이 필요한 페이지
- / (Home)
- /example (예문 생성기)
- /writing (문제 생성기)
- /vocabulary (단어장)
- /my-questions (저장된 문제)

// 인증 불필요 페이지
- /login (로그인)
- /signup (회원가입)
```

---

## 🎵 TTS (Text-to-Speech) 시스템

### 이중화 구조

1. **Google Cloud TTS** (우선)
   - 고품질 음성 합성
   - 남성/여성 음성 선택 가능
   - Base64 인코딩된 오디오 재생

2. **Web Speech API** (폴백)
   - Google TTS 실패 시 자동 전환
   - 브라우저 내장 TTS 엔진 사용
   - 별도의 서버 요청 없이 동작

### 재생 옵션

- **재생 제어**: 클릭으로 재생/정지 전환
- **속도 조절**: 컴포넌트 설정을 통한 속도 조정 가능 (느리게 0.75x, 보통 1.0x, 빠르게 1.25x)
---

## 📊 영작 채점 알고리즘

### 채점 기준 (가중치)

1. **유사도 점수 (50%)**
   - Levenshtein Distance 알고리즘 사용
   - 문자열 간 편집 거리 계산
   
2. **키워드 매칭 (30%)**
   - 불용어(stopwords) 제거
   - 핵심 단어 일치율 계산
   
3. **길이 점수 (20%)**
   - 모범 답안 대비 적정 길이 평가

### 점수 등급

- **Excellent (85~100점)**: 완벽하거나 거의 완벽한 답안
- **Good (70~84점)**: 좋은 답안, 약간의 개선 필요
- **Fair (50~69점)**: 괜찮은 답안, 개선의 여지 있음
- **Poor (0~49점)**: 많은 개선 필요

---

## 🔧 API 통신 구조

### Axios 인터셉터

#### Request Interceptor
```typescript
// /auth/** 경로를 제외한 모든 요청에 JWT 토큰 자동 추가
Authorization: Bearer {token}
```

#### Response Interceptor
```typescript
// 401/403 에러 시 자동 로그아웃 및 리다이렉트
// 에러 메시지 표준화 처리
```

### API 엔드포인트
```typescript
// 인증
POST /auth/signup          // 회원가입
POST /auth/login           // 로그인
GET  /auth/check-username  // 아이디 중복 확인
GET  /auth/check-phone     // 전화번호 중복 확인

// 예문 생성
POST /generate/examples    // 단어 예문 생성

// 문제 생성
POST /generate/questions   // 토익/영작 문제 생성

// 단어장
GET    /words              // 단어 목록 조회
POST   /words              // 단어 저장
DELETE /words/:id          // 단어 삭제
GET    /words/search       // 단어 검색
GET    /words/count        // 단어 개수

GET    /examples           // 예문 목록 조회
POST   /examples           // 예문 저장
DELETE /examples/:id       // 예문 삭제
GET    /examples/search    // 예문 검색
GET    /examples/count     // 예문 개수

// 문제 관리
GET    /questions          // 전체 문제 조회
POST   /questions          // 문제 저장
DELETE /questions/:id      // 문제 삭제
GET    /questions/toeic    // 토익 문제 조회
GET    /questions/toeic/:part  // 토익 파트별 조회
GET    /questions/writing  // 영작 문제 조회
GET    /questions/search   // 주제로 검색
GET    /questions/count    // 문제 개수

// TTS
POST /tts/speak            // 음성 합성
GET  /tts/status           // TTS 서비스 상태 확인
```

---

## 개발

본 프로젝트는 GitHub Copilot (Claude Sonnet 4.5I를 활용하여 코드 작성, 리팩토링 작업을 수행했습니다.

---

## 저장소

본 프로젝트는 2개의 저장소로 구성되어 있습니다:

- **프론트엔드 (React)** - 현재 저장소
  
- **백엔드 (Spring Boot)** - API 서버 및 Google Cloud TTS 연동
  - https://github.com/HeoSeonJin0504/ai-english-trainer-spring.git