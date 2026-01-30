# AI English Trainer (Frontend - React)

OpenAI GPT API와 Google Cloud TTS를 활용한  
AI 기반 영어 학습 플랫폼의 프론트엔드입니다.

사용자가 입력한 영어 단어를 기반으로 AI가 자동으로 예문, 품사, 의미, 유의어/반의어를 생성하고, 토익(TOEIC) 문제 또는 영작 문제를 자동 출제하는 학습 시스템입니다. Google Cloud TTS를 통해 생성된 텍스트를 음성으로 들을 수 있으며, 학습한 내용을 체계적으로 관리할 수 있습니다.
               
### 주요 기능
- JWT 기반 회원가입 / 로그인
- AI 예문 생성 (품사별 뜻, 예문 3개, 유의어/반의어)
- TOEIC(Part 5/6/7) 및 영작 문제 자동 출제
- Levenshtein Distance 기반 영작 자동 채점 (0~100점)
- Google Cloud TTS 및 Web Speech API 이중화 음성 재생
- 단어장 및 문제 저장 관리

## 🛠️ 기술 스택
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: styled-components
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Auth**: JWT (LocalStorage)
- **TTS**: Google Cloud TTS / Web Speech API

## 📁 프로젝트 구조
```
src/
├── components/       # 재사용 컴포넌트 (Button, Card, Input, SpeakerButton 등)
├── pages/           # 페이지 (Login, Home, ExampleGenerator, WritingProblem 등)
├── services/        # API 통신 (Axios 인스턴스, JWT 인터셉터)
├── utils/           # 유틸리티 (grading.ts: 채점 알고리즘, tts.ts: 음성 재생)
└── App.tsx          # 라우팅 및 인증 가드

```

## 💡 핵심 구현 사항
### 1. Levenshtein Distance 알고리즘 기반 채점
- 동적 프로그래밍을 활용한 문자열 편집 거리 계산
- 유사도(50%) + 키워드 매칭(30%) + 길이 점수(20%) 가중 평균으로 0~100점 산출
- 사용자 답안과 모범 답안의 정확도 자동 평가

### 2. TTS 이중화 시스템
- Google Cloud TTS API 우선 사용으로 고품질 음성 제공
- 미설정 시 Web Speech API로 자동 폴백하여 무중단 음성 재생

### 3. JWT 기반 인증 시스템
- Axios 인터셉터를 활용한 JWT 토큰 자동 관리
- 401/403 에러 발생 시 자동 로그아웃 및 리다이렉트 처리
- LocalStorage를 활용한 토큰 관리

### 4. 재사용 가능한 컴포넌트 설계
- styled-components를 활용한 UI 컴포넌트 모듈화
- Button, Card, Input 등 atomic 패턴 적용

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
`.env.example` 파일을 참고하여 `.env` 파일을 생성합니다.
```env
# Node.js 백엔드 사용 시
VITE_API_BASE_URL=http://localhost:3000/api

# Spring Boot 백엔드 사용 시
# VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. 서버 실행
```bash
npm run dev
```

서버가 정상적으로 실행되면 브라우저에서 `http://localhost:5173` 접속

### 주의사항
- 백엔드 서버가 먼저 실행되어 있어야 합니다
- `.env` 파일은 절대 Git에 커밋하지 마세요

## 저장소
본 프로젝트는 3개의 저장소로 구성되어 있습니다:

- **프론트엔드 (React)** - 현재 저장소
  
- **백엔드 (Node.js)** - API 서버 및 Google Cloud TTS 연동
  - https://github.com/HeoSeonJin0504/ai-english-trainer-node.git

- **백엔드 (Java Spring)** - API 서버 및 Google Cloud TTS 연동
  - https://github.com/HeoSeonJin0504/ai-english-trainer-spring.git