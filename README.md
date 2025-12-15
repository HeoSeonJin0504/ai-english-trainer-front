# AI English Trainer (Front)

AI English Trainer는 OpenAI GPT와 Google Cloud TTS를 활용한 영어 학습 플랫폼입니다.

---

## 📌 프로젝트 개요

사용자가 입력한 영어 단어를 기반으로 AI가 자동으로 예문, 품사, 의미, 유의어/반의어를 생성하고, 토익(TOEIC) 문제 또는 영작 문제를 자동 출제하는 학습 시스템입니다. Google Cloud TTS를 통해 생성된 텍스트를 음성으로 들을 수도 있습니다.

### 주요 기능

- **예문 생성기**: 단어를 입력하면 AI가 품사별 뜻, 예문, 유의어/반의어를 제공
- **영어 문제 생성기**: 토익(Part 5/6/7) 및 영작 문제 자동 출제
- **나의 단어장**: 저장한 단어와 예문을 언제든지 확인하고 관리
- **TTS 음성 재생**: Google Cloud TTS를 사용한 텍스트 음성 변환

### 페이지 구성

| 페이지 | 설명 |
|--------|------|
| **홈(Home)** | 서비스 소개 및 기능 안내 |
| **예문 생성기(ExampleGenerator)** | 단어 입력 시 예문, 뜻, 관련 단어 생성 |
| **영어 문제(WritingProblem)** | 토익/영작 문제 생성 및 풀이 |
| **나의 단어장(Vocabulary)** | 저장된 단어 및 예문 관리 |

---

## 🛠️ 기술 스택 (Tech Stack)

### Core
- **React 19** - 사용자 인터페이스 구축
- **TypeScript** - 타입 안정성 및 개발 생산성 향상
- **Vite** - 빠른 개발 서버 및 빌드 도구

### UI/UX
- **styled-components** - CSS-in-JS 스타일링
- **React Router** - 페이지 라우팅 및 네비게이션

### HTTP 통신
- **Axios** - REST API 통신

### TTS (Text-to-Speech)
- **Google Cloud TTS API** - 고품질 음성 합성
- **Web Speech API** - 브라우저 기본 TTS (폴백)

### 코드 품질
- **ESLint** - 코드 품질 검사
- **TypeScript ESLint** - TypeScript 린트 규칙

---

## 📁 프로젝트 구조

```
ai-english-trainer-front/
├── public/                
├── src/
│   ├── components/       # 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── Input.tsx
│   │   ├── Layout.tsx
│   │   ├── Loading.tsx
│   │   └── SpeakerButton.tsx  # TTS 재생 버튼
│   ├── pages/            # 페이지 
│   │   ├── Home.tsx
│   │   ├── ExampleGenerator.tsx
│   │   ├── WritingProblem.tsx
│   │   ├── Vocabulary.tsx
│   │   └── index.ts
│   ├── services/         # API 통신 로직
│   │   └── api.ts        # Axios 인스턴스 및 API 함수
│   ├── utils/            # 유틸리티 함수
│   │   ├── grading.ts    # 영작 채점 로직
│   │   ├── tts.ts        # TTS 재생 유틸리티
│   │   └── vocabulary.ts # 단어장 관리 (localStorage)
│   ├── App.tsx           
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
VITE_API_BASE_URL=http://localhost:3000/api
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 5. 프로덕션 빌드

```bash
npm run build
npm run preview
```

---

## 📝 주요 기능 상세

### 1. 예문 생성기

- **단어 입력**: 영어 단어만 입력 가능 (한글 입력 차단)
- **AI 예문 생성**: 단어의 품사별 뜻, 3개의 예문, 유의어/반의어 제공
- **TTS 음성 재생**: 단어 및 예문을 음성으로 들을 수 있음
- **단어장 저장**: 마음에 드는 예문을 단어장에 저장

### 2. 영어 문제 생성기

#### 토익 모드
- **Part 5**: 문법·어휘 문제
- **Part 6**: 문장 삽입 문제
- **Part 7**: 독해 문제
- 정답 확인 및 해설 제공

#### 영작 모드
- **4가지 문제 유형**: 상황 설명 영작, 한→영 번역, 문장 고치기, 짧은 답변
- **자동 채점**: 유사도, 키워드 매칭, 길이 점수를 종합하여 0~100점 채점
- **모범 답안 제공**: 학습 후 모범 답안 확인 가능

### 3. 나의 단어장

- **저장된 단어 조회**: 예문 생성기에서 저장한 단어 목록 확인
- **TTS 재생**: 각 단어와 예문을 음성으로 들을 수 있음
- **삭제 기능**: 불필요한 단어 제거

---
## 개발
본 프로젝트는 GitHub Copilot (Claude Sonnet 4.5) 및 Claude Sonnet 4.5 AI를 활용하여 코드 작성, 리팩토링 및 문서화 작업을 수행했습니다.

## 저장소

본 프로젝트는 2개의 저장소로 구성되어 있습니다:

- **프론트엔드 (React)** - 현재 저장소

- **백엔드 (Node.js)** - API 서버 및 Google Cloud TTS 연동
  - https://github.com/HeoSeonJin0504/ai-english-trainer-node.git
